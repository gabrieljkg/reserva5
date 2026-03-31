// src/components/ChatWidget.tsx
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_admin: boolean;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [session, setSession] = useState<any>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) getOrCreateChat(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        getOrCreateChat(session.user);
      } else {
        setChatId(null);
        setMessages([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
      const channel = supabase
        .channel(`chat:${chatId}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        }, (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getOrCreateChat = async (user: any) => {
    if (!user) return;
    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';
    const { data: existingChat } = await supabase.from('chats').select('id').eq('user_id', user.id).maybeSingle();

    if (existingChat) {
      setChatId(existingChat.id);
      await supabase.from('chats').update({ user_name: userName, user_email: user.email }).eq('id', existingChat.id);
    } else {
      const { data: newChat } = await supabase.from('chats').insert([{ user_id: user.id, user_name: userName, user_email: user.email }]).select().maybeSingle();
      if (newChat) setChatId(newChat.id);
    }
  };

  const fetchMessages = async () => {
    if (!chatId) return;
    const { data } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
    setMessages(data || []);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !session || sending) return;
    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    const { error } = await supabase.from('messages').insert([{ chat_id: chatId, sender_id: session.user.id, content, is_admin: false }]);
    if (error) {
      alert('Erro ao enviar!');
      setNewMessage(content);
    } else {
      supabase.from('chats').select('unread_count_admin').eq('id', chatId).maybeSingle().then(({ data }) => {
        supabase.from('chats').update({ last_message_at: new Date().toISOString(), unread_count_admin: (data?.unread_count_admin || 0) + 1 }).eq('id', chatId);
      });
    }
    setSending(false);
  };

  if (!session) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[350px] h-[500px] bg-paper rounded-3xl shadow-2xl border border-ink/10 overflow-hidden flex flex-col">
            <div className="p-6 bg-ink text-paper flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-paper/10 rounded-full flex items-center justify-center"><User className="w-5 h-5" /></div>
                <div><h3 className="font-bold text-sm">Suporte Online</h3><p className="text-[10px] opacity-60 uppercase tracking-widest">Estamos online</p></div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-paper/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-ink/[0.02]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.is_admin ? 'bg-white text-ink rounded-tl-none border border-ink/5' : 'bg-ink text-paper rounded-tr-none'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-ink/10 flex gap-2">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Digite sua mensagem..."
                className="flex-1 bg-ink/5 border-none p-3 text-sm outline-none focus:ring-1 focus:ring-ink rounded-xl" />
              <button type="submit" disabled={!newMessage.trim() || sending} className="bg-ink text-paper p-3 rounded-xl hover:bg-ink/90 transition-colors disabled:opacity-50">
                {sending ? <div className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setIsOpen(!isOpen)} className="w-14 h-14 bg-ink text-paper rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
