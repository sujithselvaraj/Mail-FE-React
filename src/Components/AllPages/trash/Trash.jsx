import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './trash.css';
import LeftSideBar from '../../LeftSideRouteBar/LeftSideBar';
import Navbar from '../Navbar/Navbar';
import { format } from 'date-fns';

function Trash() {
  const [deletedMails, setDeletedMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMail, setSelectedMail] = useState(null);
  const [selectedMailId, setSelectedMailId] = useState(null);


  useEffect(() => {
    fetchDeletedMails();
  }, []);

  const fetchDeletedMails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/mails/deleted-mails', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setDeletedMails(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching deleted mails.');
      setLoading(false);
    }
  };

  const handleViewMail = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/mails/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSelectedMail(response.data);
      setSelectedMailId(id); 

    } catch (error) {
      console.error('Error fetching mail details:', error);
      setError('Error fetching mail details.');
    }
  };


  return (
    <div className="trash">
      <Navbar/>
      <div className="Mail-List">
      <LeftSideBar/>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {deletedMails.map((mail) => (
          <li key={mail.id} className={mail.id === selectedMailId ? 'selected-mail' : ''}
          onClick={() => handleViewMail(mail.id)}>
            <div className='div'>
              <p>{mail.sender}</p>
              <p>{mail.subject}</p>
              <p>{format(new Date(mail.time), 'MMM d')}</p>
            </div>
          </li>
        ))}
      </ul>
          </div>
          <div className='Viewing-Mail'>
      {selectedMail ? (
        <div >
          <h2>Viewing Mail</h2>
          <p>Recipients: {selectedMail.recipients}</p>
          <p>Subject: {selectedMail.subject}</p>
          <p>Content: {selectedMail.content}</p>
          {/* Add other mail details as needed */}
        </div>
      ) : (
        <p>Select a mail to view</p>
      )}
      </div>

    </div>
  );
}

export default Trash;
