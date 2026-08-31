import { api } from "@repo/backend/convex/_generated/api";
import type { Id } from "@repo/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowRight,
  ChevronRight,
  CirclePlus,
  LoaderCircle,
  MessageCircle,
  PenLine,
  Send,
  StickyNote,
  UserRound,
  X,
} from "lucide-react";
import { useState, type FormEvent } from "react";

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
  }).format(timestamp);
}

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Try again.";
}

function UsernameGate({ onJoin }: { onJoin: (username: string) => void }) {
  const [username, setUsername] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = username.trim();
    if (trimmed.length < 2) return;
    onJoin(trimmed.slice(0, 24));
  }

  return (
    <main className="gate-shell">
      <div className="gate-grid" aria-hidden="true" />
      <section className="gate-card">
        <div className="gate-brand">
          <span className="brand-mark"><StickyNote size={21} strokeWidth={2.4} /></span>
          <span>Margin</span>
        </div>
        <p className="gate-kicker">A shared space for small thoughts</p>
        <h1>Leave a note.<br /><em>Start a conversation.</em></h1>
        <p className="gate-copy">
          No account, no profile setup. Choose a name so people know who is writing.
        </p>
        <form className="gate-form" onSubmit={handleSubmit}>
          <label htmlFor="username">What should we call you?</label>
          <div className="gate-input-row">
            <UserRound size={20} aria-hidden="true" />
            <input
              autoFocus
              id="username"
              maxLength={24}
              minLength={2}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Your username"
              required
              value={username}
            />
            <button aria-label="Enter Margin" disabled={username.trim().length < 2} type="submit">
              <ArrowRight size={20} />
            </button>
          </div>
          <span className="gate-hint">2-24 characters. You can change this later.</span>
        </form>
      </section>
      <aside className="gate-aside" aria-hidden="true">
        <div className="floating-note floating-note-one">
          <span>01</span>
          <p>What if we kept all the good ideas in one place?</p>
        </div>
        <div className="floating-note floating-note-two">
          <MessageCircle size={17} />
          <p>I’d add a thought to that.</p>
          <b>+ 3 replies</b>
        </div>
      </aside>
    </main>
  );
}

function App() {
  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem("margin.username"),
  );
  const [selectedId, setSelectedId] = useState<Id<"notes"> | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [comment, setComment] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notes = useQuery(api.notes.list);
  const createNote = useMutation(api.notes.create);
  const addComment = useMutation(api.comments.add);
  const selectedNote = notes?.find((note) => note._id === selectedId) ?? notes?.[0];
  const comments = useQuery(
    api.comments.list,
    selectedNote ? { noteId: selectedNote._id } : "skip",
  );

  function join(name: string) {
    localStorage.setItem("margin.username", name);
    setUsername(name);
  }

  function changeUsername() {
    localStorage.removeItem("margin.username");
    setUsername(null);
  }

  async function handleCreateNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username || !title.trim() || !body.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      const noteId = await createNote({ author: username, body, title });
      setSelectedId(noteId);
      setTitle("");
      setBody("");
      setIsComposing(false);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username || !selectedNote || !comment.trim()) return;
    setIsCommenting(true);
    setError(null);
    try {
      await addComment({ author: username, body: comment, noteId: selectedNote._id });
      setComment("");
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsCommenting(false);
    }
  }

  if (!username) {
    return <UsernameGate onJoin={join} />;
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <a className="app-brand" href="#top" aria-label="Margin home">
          <span className="brand-mark"><StickyNote size={19} strokeWidth={2.5} /></span>
          <span>Margin</span>
        </a>
        <p className="header-manifesto">Thoughts become better when shared.</p>
        <button className="user-chip" onClick={changeUsername} title="Change username" type="button">
          <span>{username.charAt(0).toUpperCase()}</span>
          <b>{username}</b>
          <span className="user-chip-action">change</span>
        </button>
      </header>

      <div className="workspace" id="top">
        <aside className="note-rail">
          <div className="rail-heading">
            <div>
              <span className="eyebrow">Community board</span>
              <h1>Notes</h1>
            </div>
            <button
              aria-label="Create a note"
              className="new-note-button"
              onClick={() => {
                setError(null);
                setIsComposing(true);
              }}
              type="button"
            >
              <CirclePlus size={21} />
              <span>New note</span>
            </button>
          </div>

          {isComposing && (
            <form className="composer" onSubmit={handleCreateNote}>
              <div className="composer-heading">
                <span><PenLine size={15} /> New note</span>
                <button aria-label="Close composer" onClick={() => setIsComposing(false)} type="button">
                  <X size={17} />
                </button>
              </div>
              <input
                aria-label="Note title"
                autoFocus
                maxLength={80}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Give it a title"
                required
                value={title}
              />
              <textarea
                aria-label="Note body"
                maxLength={2_000}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Write down your thought..."
                required
                rows={5}
                value={body}
              />
              <div className="composer-footer">
                <span>{body.length}/2000</span>
                <button disabled={isSaving || !title.trim() || !body.trim()} type="submit">
                  {isSaving ? <LoaderCircle className="spin" size={16} /> : "Publish note"}
                </button>
              </div>
            </form>
          )}

          <div className="note-list" aria-live="polite">
            {notes === undefined ? (
              <div className="rail-state"><LoaderCircle className="spin" /> Loading notes</div>
            ) : notes.length === 0 ? (
              <button className="empty-rail" onClick={() => setIsComposing(true)} type="button">
                <StickyNote size={28} />
                <strong>The board is blank</strong>
                <span>Pin up the first note.</span>
              </button>
            ) : (
              notes.map((note, index) => {
                const isSelected = note._id === selectedNote?._id;
                return (
                  <button
                    className={`note-list-item${isSelected ? " is-selected" : ""}`}
                    key={note._id}
                    onClick={() => {
                      setError(null);
                      setSelectedId(note._id);
                    }}
                    type="button"
                  >
                    <span className="note-number">{String(notes.length - index).padStart(2, "0")}</span>
                    <span className="note-summary">
                      <strong>{note.title}</strong>
                      <span>by {note.author} · {formatDate(note.createdAt)}</span>
                    </span>
                    <span className="comment-count"><MessageCircle size={14} /> {note.commentCount}</span>
                    <ChevronRight className="note-chevron" size={17} />
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className="conversation">
          {selectedNote ? (
            <>
              <article className="focused-note">
                <div className="note-meta">
                  <span className="eyebrow">Note from the board</span>
                  <span>{formatDate(selectedNote.createdAt)} · {formatTime(selectedNote.createdAt)}</span>
                </div>
                <h2>{selectedNote.title}</h2>
                <p className="note-body">{selectedNote.body}</p>
                <footer className="note-author">
                  <span>{selectedNote.author.charAt(0).toUpperCase()}</span>
                  <div><b>{selectedNote.author}</b><small>started this note</small></div>
                </footer>
              </article>

              <div className="thread">
                <div className="thread-heading">
                  <h3>Conversation</h3>
                  <span>{selectedNote.commentCount} {selectedNote.commentCount === 1 ? "reply" : "replies"}</span>
                </div>

                <div className="comments" aria-live="polite">
                  {comments === undefined ? (
                    <div className="comment-state"><LoaderCircle className="spin" /> Loading conversation</div>
                  ) : comments.length === 0 ? (
                    <div className="comment-state empty-comment-state">
                      <MessageCircle size={24} />
                      <div><strong>No replies yet.</strong><span>Be the first to add to this thought.</span></div>
                    </div>
                  ) : (
                    comments.map((item) => (
                      <article className="comment" key={item._id}>
                        <span className="comment-avatar">{item.author.charAt(0).toUpperCase()}</span>
                        <div>
                          <header><b>{item.author}</b><time>{formatTime(item.createdAt)}</time></header>
                          <p>{item.body}</p>
                        </div>
                      </article>
                    ))
                  )}
                </div>

                <form className="comment-form" onSubmit={handleAddComment}>
                  <span className="comment-avatar current-user">{username.charAt(0).toUpperCase()}</span>
                  <div>
                    <textarea
                      aria-label="Add a comment"
                      maxLength={500}
                      onChange={(event) => setComment(event.target.value)}
                      placeholder={`Reply as ${username}...`}
                      required
                      rows={3}
                      value={comment}
                    />
                    <footer>
                      <span>{comment.length}/500</span>
                      <button disabled={isCommenting || !comment.trim()} type="submit">
                        {isCommenting ? <LoaderCircle className="spin" size={16} /> : <><span>Post reply</span><Send size={15} /></>}
                      </button>
                    </footer>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="empty-conversation">
              <div className="empty-icon"><StickyNote size={34} /></div>
              <span className="eyebrow">Nothing here yet</span>
              <h2>Make a little room<br />for a big thought.</h2>
              <p>Create the first note and invite someone into the conversation.</p>
              <button onClick={() => setIsComposing(true)} type="button"><PenLine size={17} /> Write a note</button>
            </div>
          )}
          {error && <div className="error-toast" role="alert"><span>{error}</span><button onClick={() => setError(null)} type="button"><X size={15} /></button></div>}
        </section>
      </div>
    </main>
  );
}

export default App;
