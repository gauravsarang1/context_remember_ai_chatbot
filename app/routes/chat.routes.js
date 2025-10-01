import { createChat, getChats} from '../controllers/chat.controllers.js'
import { Router } from 'express'

const router = Router();

router.get('/chats', getChats);
router.post('/chats', createChat);

export default router