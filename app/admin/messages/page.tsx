"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Loader2,
  Mail,
  Phone,
  User,
  CheckCircle2,
  Trash2,
  MessageSquare,
  Clock,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  purpose: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminMessagesPage() {
  const supabase = createClient();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load messages");
    } else if (data) {
      setMessages(data);
    }
    setLoading(false);
  }

  const markAsResolved = async (id: string) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: "resolved" })
        .eq("id", id);

      if (error) throw error;

      toast.success("Message marked as resolved!");
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, status: "resolved" } : m)),
      );
    } catch (error: any) {
      toast.error("Failed to update status: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteMessage = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this message?",
      )
    )
      return;

    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Message deleted.");
      setMessages(messages.filter((m) => m.id !== id));
    } catch (error: any) {
      toast.error("Failed to delete message: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <Loader2 className="animate-spin text-green-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            Lab Inquiries
          </h1>
          <div className="text-sm font-bold text-slate-500">
            Total Messages: {messages.length}
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <MessageSquare size={32} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Inbox is Empty</h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              When clients send messages through the contact form, they will
              appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-white border rounded-2xl p-6 shadow-sm space-y-5 flex flex-col transition-all ${
                  msg.status === "resolved"
                    ? "border-slate-200/60 opacity-75"
                    : "border-green-200 shadow-green-900/5"
                }`}
              >
                {/* Header: Status and Date */}
                <div className="flex justify-between items-start">
                  <div>
                    {msg.status === "new" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-wider border border-amber-200">
                        <Clock size={12} /> Needs Reply
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider border border-slate-200">
                        <CheckCircle2 size={12} /> Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-400">
                    {new Date(msg.created_at).toLocaleString("en-NG")}
                  </p>
                </div>

                {/* Contact Details */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-900 font-bold">
                    <User size={16} className="text-slate-400" />
                    {msg.name}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600 font-medium">
                    <a
                      href={`mailto:${msg.email}`}
                      className="flex items-center gap-1.5 hover:text-green-600 transition-colors"
                    >
                      <Mail size={14} className="text-slate-400" /> {msg.email}
                    </a>
                    {msg.phone && (
                      <a
                        href={`tel:${msg.phone}`}
                        className="flex items-center gap-1.5 hover:text-green-600 transition-colors"
                      >
                        <Phone size={14} className="text-slate-400" />{" "}
                        {msg.phone}
                      </a>
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-1.5 text-xs font-bold text-green-700 uppercase tracking-wider">
                    <Tag size={14} />
                    {msg.purpose.replace("_", " ")}
                  </div>
                </div>

                {/* Message Body */}
                <div className="flex-1">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>

                {/* Action Controls */}
                <div className="pt-4 border-t border-slate-100 flex gap-2">
                  {msg.status === "new" && (
                    <button
                      onClick={() => markAsResolved(msg.id)}
                      disabled={updatingId === msg.id}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      {updatingId === msg.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={14} />
                      )}
                      Mark as Resolved
                    </button>
                  )}

                  <a
                    href={`mailto:${msg.email}`}
                    className="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 text-center"
                  >
                    <Mail size={14} /> Reply
                  </a>

                  <button
                    onClick={() => deleteMessage(msg.id)}
                    disabled={updatingId === msg.id}
                    className="px-3 border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-bold py-2.5 rounded-lg transition-colors"
                    title="Delete Message"
                  >
                    {updatingId === msg.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
