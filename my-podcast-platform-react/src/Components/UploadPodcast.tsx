import React, { useState } from 'react';
import { connect } from 'react-redux';
import { uploadPodcast } from '../store/actions/appActions';
import NavigationMenu from './NavigationMenu';
import './UploadPodcast.css'; // Import the CSS file
import { RootState } from '../store/reducers';

interface UploadPodcastProps {
  uploadPodcast: (podcast: any) => void;
  email: string;
}

const UploadPodcast: React.FC<UploadPodcastProps> = ({ uploadPodcast, email }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('zabavno');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (file && title) {
      const fileName = file.name;
      const filePath = `/uploads/${fileName}`; 
      const podcast = {
        title,
        category,
        pathToVideo: filePath, 
        hostEmail: email,
        numberOfLikes: 0,
      };

      uploadPodcast(podcast);
      setFile(null);
      setTitle('');
      setCategory('zabavno');
      alert('Video uploadovan!');
    }
  };

  return (
    <div>
      <NavigationMenu userType="host" />
      <div className="upload-podcast">
        <div className="upload-content">
          <h1>Upload Podcast</h1>
          <hr />
          <form onSubmit={handleSubmit}>
            <div>
              <label>Video File:&nbsp;</label>
              <input type="file" accept="video/*" onChange={handleFileChange} />
            </div>
            <div>
              <label>Title:&nbsp;</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label>Kategorija:&nbsp;</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="zabavno">Zabavno</option>
                <option value="edukativno">Edukativno</option>
                <option value="ostalo">Ostalo</option>
              </select>
            </div>
            <button type="submit">Upload</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  email: state.welcome.currentUser?.email || '' 
});

const mapDispatchToProps = (dispatch: any) => ({
  uploadPodcast: (podcast: any) => dispatch(uploadPodcast(podcast)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadPodcast);
