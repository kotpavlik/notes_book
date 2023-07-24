
import { Button, IconButton } from '@mui/material';
import { AddNoteModal } from '../modalsNote/addNote';
import style from './notes.module.scss'
import { Hashtag, Note } from '../../indexedDB/indexedDb';
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import { useAppDispatch } from '../../redux/store';
import { deleteExistingNote } from '../../redux/notesSlice';
import { EditNoteModal } from '../modalsNote/editNoteModal';
import { SearchNote } from '../searchNote/searchNote';

interface NotesType {
    status: string
    error: string | null
    notes: Note[]
    hashtags: Hashtag[]
}

export const Notes = ({ status, error, notes, hashtags }: NotesType) => {



    const dispatch = useAppDispatch()


    const deleteNoteHandler = (noteId: number) => {
        dispatch(deleteExistingNote(noteId))
    }



    return (
        <div className={style.all_notes_wrapper}>
            <div className={style.header}>

                <div className={style.buttons}>
                    <AddNoteModal>
                        <Button className={style.button}
                            disabled={status === "loading"}
                            variant="outlined"
                            type="submit">new note</Button>
                    </AddNoteModal>
                    <div className={style.search}><SearchNote /></div>
                </div>

                <h1 className={style.title}>Notes</h1>

            </div>

            <div className={style.notes}>
                {notes.map((note, index) =>
                    <div
                        key={index}
                        className={style.note} >
                        <div className={style.buttons}>
                            <EditNoteModal note={note}>
                                <IconButton
                                    size="small">
                                    <DriveFileRenameOutlineOutlinedIcon />
                                </IconButton>
                            </EditNoteModal>
                            <IconButton
                                onClick={() => deleteNoteHandler(note.id!)}
                                size="small">
                                <DeleteForeverOutlinedIcon />
                            </IconButton>

                        </div>
                        <div className={style.about_note}>
                            <div className={style.title}>Name: {note.title}</div>
                            <div className={style.content}>{note.content}</div>
                        </div>
                        <div className={style.hashtags}>
                            {note.hashtags.map((hashtag, index) =>
                                <span
                                    key={index}
                                    className={style.hashtags_wrapepr}>
                                    #{hashtag}
                                </span>)}
                        </div>
                    </div>

                )}
            </div>

        </div>

    );
}