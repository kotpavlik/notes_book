import { useEffect } from 'react';
import style from './App.module.scss'
import { ErrorSnackbar } from './common/error_snack_bar/errorSnackBar';
import { AnimationLoading } from './common/lottie_animation/lottie_loading_animation';
import { useAppDispatch, useAppSelector } from './redux/store';
import { initializedAppAC } from './redux/appSlice';
import { fetchHashtags } from './redux/hashtagSlice';
import { fetchNotes } from './redux/notesSlice';
import { Notes } from './components/notes/notes';




function App() {

  const initialaized = useAppSelector(state => state.App.initialized)
  const dispatch = useAppDispatch()

  const notes = useAppSelector(state => state.Notes.notes);
  const hashtags = useAppSelector(state => state.Hashtags.hashtags);
  const status = useAppSelector(store => store.App.status);
  const error = useAppSelector(store => store.App.error)

  useEffect(() => {
    setTimeout(() => {
      dispatch(initializedAppAC());
    }, 300);
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchNotes());
    dispatch(fetchHashtags());
  }, [dispatch]);

  if (initialaized) {
    return (
      <div className={style.app}>
        <div className={style.animation}>
          <AnimationLoading />
        </div>
      </div>
    );
  }

  return (
    <div className={style.app}>
      <ErrorSnackbar />
      <Notes error={error} hashtags={hashtags} notes={notes} status={status} />
    </div>
  );
}

export default App;






