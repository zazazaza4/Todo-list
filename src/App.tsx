import { useMemo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import { v4 as uuidV4 } from "uuid";

import { EditNote, NewNote, Note, NoteList } from "./pages";
import { useLocalStrorage } from "./hooks";
import { NoteLayout } from "./layouts";

import { NoteData, RawNote, Tag } from "./types";

function App() {
  const [notes, setNotes] = useLocalStrorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStrorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  const onCreateNote = ({ tags, ...data }: NoteData) => {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  };

  const onUpdateNote = (id: string, { tags, ...data }: NoteData) => {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        }
        return note;
      });
    });
  };

  const onDeleteNote = (id: string) => {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  };

  const addTag = (tag: Tag): void => {
    setTags((prev) => [...prev, tag]);
  };

  const updateTag = (id: string, label: string): void => {
    setNotes((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        }
        return tag;
      });
    });
  };

  const deleteTag = (id: string): void => {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });
  };

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              notes={notesWithTags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
              avaliableTags={tags}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onAddTag={addTag}
              onSubmit={onCreateNote}
              avaliableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onAddTag={addTag}
                onSubmit={onUpdateNote}
                avaliableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
