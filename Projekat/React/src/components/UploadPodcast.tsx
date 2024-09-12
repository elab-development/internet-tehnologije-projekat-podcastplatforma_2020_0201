import React, { useState } from 'react';
import { connect } from 'react-redux';
import { uploadPodcastRequest } from '../store/actions/appActions';
import NavigationMenu from './NavigationMenu';
import './UploadPodcast.css'; 
import { RootState } from '../store/reducers';

interface UploadPodcastProps {
  uploadPodcastRequest: (formData: FormData, token:string) => void;
  email: string;
  token: string;
}

const UploadPodcast: React.FC<UploadPodcastProps> = ({ uploadPodcastRequest, email, token }) => {
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
    if (file && title && email) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('email', email);
      formData.append('video', file);

      uploadPodcastRequest(formData,token);
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
              <label>Category:&nbsp;</label>
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
  email: state.welcome.currentUser?.email || '',
  token: state.welcome.currentUser?.token || ''
});

const mapDispatchToProps = (dispatch: any) => ({
  uploadPodcastRequest: (formData: FormData, token:string) => dispatch(uploadPodcastRequest(formData,token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadPodcast);
