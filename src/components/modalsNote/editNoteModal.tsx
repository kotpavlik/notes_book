import style from './addNote.module.scss'
import { BasicModal } from '../../common/modal/basicModal';
import React, { KeyboardEvent, ReactNode, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { updateExistingNote } from '../../redux/notesSlice';
import { Note } from '../../indexedDB/indexedDb';



interface EditNoteModalType {
    children: ReactNode
    note: Note

}

export const EditNoteModal = ({ children, note }: EditNoteModalType) => {

    const my_note = useAppSelector(state => state.Notes.notes.find(n => note.id === n.id))

    const [valueInputContent, setValueInputContent] = useState<string>(my_note!.content)
    const [valueTitleInput, setValueTitelInput] = useState<string>(my_note!.title)

    const dispatch = useAppDispatch()
    const status = useAppSelector(state => state.App.status)
    const isLoading = status === 'loading'

    const editNewNote = async (handleClose: () => void) => {
        const hashtagRegex = /#(\w+)/g;
        const foundHashtags = valueInputContent.match(hashtagRegex);
        if (foundHashtags) {
            const cleanedHashtags = foundHashtags.map((tag) => tag.substring(1));
            await dispatch(updateExistingNote({
                id: my_note!.id,
                content: valueInputContent,
                title: valueTitleInput === '' ? 'No Name' : valueTitleInput,
                hashtags: cleanedHashtags
            }))
        } else {
            await dispatch(updateExistingNote({
                id: my_note!.id,
                content: valueInputContent,
                title: valueTitleInput === '' ? 'No Name' : valueTitleInput,
                hashtags: []
            }))
        }
        handleClose()
    }

    const AddNewNoteWithEnter = async (e: KeyboardEvent<HTMLDivElement>, handleClose: () => void): Promise<void> => {
        if (e.key === 'Enter') {
            await editNewNote(handleClose)
        }
    }

    return (
        <BasicModal childrenBtn={children} name={note.title ? note.title : "No Name"}>
            {(handleClose: () => void) => <>

                <div className={style.InputBlock}>
                    <TextField style={{ marginBottom: '20px' }} value={valueTitleInput}
                        onChange={(e) => setValueTitelInput(e.currentTarget.value)}
                        onKeyUp={(e) => AddNewNoteWithEnter(e, handleClose)}
                        id="standard-basic" label='Note Name' variant="standard" />
                </div>

                <div className={style.InputBlock}>
                    <TextField style={{ marginBottom: '20px' }} value={valueInputContent}
                        onChange={(e) => setValueInputContent(e.currentTarget.value)}
                        onKeyUp={(e) => AddNewNoteWithEnter(e, handleClose)}
                        id="standard-basic" label="Description" variant="standard" />
                </div>

                <div className={style.blockBtn}>
                    <Button onClick={handleClose} className={style.button} variant="outlined"
                        type="submit">Cancel</Button>
                    <Button style={{ color: 'white', backgroundColor: '#366EFF' }} onClick={() => editNewNote(handleClose)}
                        className={style.button} variant="outlined" type="submit"
                        disabled={isLoading}>Save</Button>
                </div>
            </>}
        </BasicModal>

    );
}