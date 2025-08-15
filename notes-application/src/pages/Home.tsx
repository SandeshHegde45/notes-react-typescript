import React from 'react';
import NoteList from '../components/NoteList';
import NoteEditor from '../components/NoteEditor';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Notes Application</h1>
            <NoteEditor />
            <NoteList />
        </div>
    );
};

export default Home;