
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, note: Partial<Omit<Note, "id" | "createdAt" | "updatedAt">>) => void;
  deleteNote: (id: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const savedNotes = localStorage.getItem(`notes_${user.id}`);
      if (savedNotes) {
        try {
          setNotes(JSON.parse(savedNotes));
        } catch (error) {
          console.error("Failed to parse saved notes:", error);
          setNotes([]);
        }
      } else {
        setNotes([]);
      }
    } else {
      setNotes([]);
    }
    setIsLoading(false);
  }, [user]);

  const saveNotes = (updatedNotes: Note[]) => {
    if (user) {
      localStorage.setItem(`notes_${user.id}`, JSON.stringify(updatedNotes));
    }
  };

  const addNote = (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    toast.success("Note added");
  };

  const updateNote = (id: string, updatedFields: Partial<Omit<Note, "id" | "createdAt" | "updatedAt">>) => {
    const updatedNotes = notes.map((note) =>
      note.id === id 
        ? { ...note, ...updatedFields, updatedAt: new Date().toISOString() } 
        : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    toast.success("Note updated");
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    toast.success("Note deleted");
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        isLoading,
        addNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
