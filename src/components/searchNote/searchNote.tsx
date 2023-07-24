import React, { ChangeEvent, useEffect } from 'react';
import style from './searchNote.module.scss'
import SearchIcon from '@mui/icons-material/Search';
import { Toolbar } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../redux/store';
import useDebounce from '../../hooks/useDebounce/useDebounce';
import { Search, SearchIconWrapper, StyledInputBase } from '../../common/styles_for_search/stylesforSearch';
import { notesFilters } from '../../redux/notesSlice';





export const SearchNote = () => {
    const dispatch = useAppDispatch()


    const [searchParams, setSearchParams] = useSearchParams();
    const searchQueryName = searchParams.get('search') || '';


    const debouncedValue = useDebounce<string>(searchQueryName, 700)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const form = event.target;
        const query = form.value
        const params = {
            search: query,
        }
        setSearchParams(params)
    }

    useEffect(() => {
        dispatch(notesFilters(debouncedValue))
    }, [debouncedValue, dispatch])

    return (
        <div className={style.all_wrapper_search_packs}>
            <Toolbar className={style.toolbar}>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="go search..."
                        className={style.search_input}
                        onChange={handleChange}
                        value={searchQueryName}
                    />
                </Search>
            </Toolbar>
        </div>
    );
};
