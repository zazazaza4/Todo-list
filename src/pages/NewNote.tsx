import { NoteForm } from "../components";

import { NoteData, Tag } from "../types";

type NewNoteProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  avaliableTags: Tag[];
};

export function NewNote({ onSubmit, onAddTag, avaliableTags }: NewNoteProps) {
  return (
    <>
      <h1 className="mb-4">New Note</h1>
      <NoteForm
        onSubmit={onSubmit}
        onAddTag={onAddTag}
        avaliableTags={avaliableTags}
      />
    </>
  );
}
