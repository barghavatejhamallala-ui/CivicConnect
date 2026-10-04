import { Router } from 'express';
import { deleteAccountSchema, citizenRegisterSchema, workerRegisterSchema, authorityRegisterSchema, loginSchema, changePasswordSchema, profileSchema } from '../utils/validation.js';
import { registerUser, authenticate, publicUserById, changePassword, updateProfile, deactivateUser } from '../services/users.js';
import { signToken } from '../utils/auth.js';
import { asyncHandler, ok } from '../utils/http.js';
import { requireAuth } from '../middleware/auth.js';

const router=Router();
router.post('/register/citizen',asyncHandler(async(req,res)=>{const input=citizenRegisterSchema.parse(req.body);const user=await registerUser({role:'citizen',...input});ok(res,{user:await publicUserById(user.id),token:signToken(user)},201);}));
router.post('/register/worker',asyncHandler(async(req,res)=>{const input=workerRegisterSchema.parse(req.body);const user=await registerUser({role:'worker',...input});ok(res,{user:await publicUserById(user.id),token:signToken(user)},201);}));
router.post('/register/authority',asyncHandler(async(req,res)=>{const input=authorityRegisterSchema.parse(req.body);const user=await registerUser({role:'authority',...input});ok(res,{user:await publicUserById(user.id),token:signToken(user)},201);}));
router.post('/login',asyncHandler(async(req,res)=>{const {identifier,password}=loginSchema.parse(req.body);const user=await authenticate(identifier,password);ok(res,{user:await publicUserById(user.id),token:signToken(user)});}));
router.post('/forgot-password',asyncHandler(async(_req,res)=>ok(res,{message:'If the account exists, reset instructions have been requested.'})));
router.get('/me',requireAuth,asyncHandler(async(req,res)=>ok(res,{user:await publicUserById(req.user.id)})));
router.patch('/profile',requireAuth,asyncHandler(async(req,res)=>ok(res,{user:await publicUserById((await updateProfile(req.user.id,profileSchema.parse(req.body))).id)})));
router.post('/change-password',requireAuth,asyncHandler(async(req,res)=>{const x=changePasswordSchema.parse(req.body);await changePassword(req.user.id,x.currentPassword,x.newPassword);ok(res,{message:'Password changed successfully.'});}));
router.delete('/account',requireAuth,asyncHandler(async(req,res)=>{const {password}=deleteAccountSchema.parse(req.body||{});await deactivateUser(req.user.id,password);ok(res,{message:'Account deactivated.'});}));
export default router;
