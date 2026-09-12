import { useState } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { notify } from '@/lib/toast';

const initialForm = { name: '', email: '', message: '', company: '' };

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(body.error || 'Something went wrong.');
      }

      notify.success("Thanks — I'll get back to you soon.");
      setForm(initialForm);
    } catch (err) {
      notify.error(err.message || 'Something went wrong — try emailing me directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {/* Honeypot — hidden from real visitors, catches simple bots */}
      <input
        type="text"
        name="company"
        value={form.company}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-[13px] uppercase tracking-[0.1em] text-ink-muted">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          className="border-b border-border bg-transparent py-2 text-[15px] text-ink outline-none transition-colors focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-[13px] uppercase tracking-[0.1em] text-ink-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className="border-b border-border bg-transparent py-2 text-[15px] text-ink outline-none transition-colors focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-[13px] uppercase tracking-[0.1em] text-ink-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          value={form.message}
          onChange={handleChange}
          className="resize-none border-b border-border bg-transparent py-2 text-[15px] text-ink outline-none transition-colors focus:border-accent"
        />
      </div>

      <div className="flex items-center gap-5">
        <button
          type="submit"
          disabled={sending}
          data-cursor-hover
          className="group inline-flex items-center gap-3 bg-accent px-6 py-3.5 text-[13px] font-medium uppercase tracking-[0.12em] text-accent-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {sending ? 'Sending…' : 'Send Message'}
          <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </form>
  );
}
