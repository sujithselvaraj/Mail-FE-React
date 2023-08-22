
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inbox.css';
import { format } from 'date-fns';

import LeftSideBar from '../../LeftSideRouteBar/LeftSideBar';
import Navbar from '../Navbar/Navbar';
import trash from '/Users/grootan/Downloads/hit-mail/src/assests/trash.svg';

function Inbox() {
  const [receivedMails, setReceivedMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMailId, setSelectedMailId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const sentMailsPerPage = 15; 
  const indexOfLastInboxMail = currentPage * sentMailsPerPage;
  const indexOfFirstInboxMail = indexOfLastInboxMail - sentMailsPerPage;
  const currentInboxMails = receivedMails.slice(indexOfFirstInboxMail, indexOfLastInboxMail);
    




  useEffect(() => {
    fetchReceivedMails();
  }, []);

  const fetchReceivedMails = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get('http://localhost:8080/mails/received-mails', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setReceivedMails(response.data.data.reverse());
      setLoading(false);
    } catch (error) {
      setError('Error fetching received mails.');
      setTimeout(() => {
        setError('');
      }, 3000);
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
      setError('Error fetching mail details.');
    }
  };

  const handleDeleteMail = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/mails/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReceivedMails(receivedMails.filter(mail => mail.id !== id));
    } catch (error) {
      setError('Error deleting mail.');
    }
  };

  return (
    <div className='Inbox'>
      <Navbar />
      <div className="Mail-List">
      <LeftSideBar />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
      {currentInboxMails.map((mail) => (
          <li
            key={mail.id}
            className={mail.id === selectedMailId ? 'selected-mail' : ''}
            onClick={() => handleViewMail(mail.id)}
          >
            <div>
              <p>{mail.sender}</p>
              <p className="subject">{mail.subject}</p>
              <p>{format(new Date(mail.time), 'MMM d')}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMail(mail.id);
                }}
                className='del'
              >
                <img
                  src={trash}
                  alt="Globe"
                  width="18px"
                  style={{ opacity: "0.7" }}
                />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="button">
      <div className="pagination">
  <button
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <button
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={indexOfLastInboxMail >= receivedMails.length}
  >
    Next
  </button>
  </div>
</div>
      </div>
    
      <div className='Viewing-Mail'>
      {selectedMail ? (
        <div className='Mail-Content'>
          <h3>{selectedMail.subject}</h3>
          <p>Sender : {selectedMail.sender}</p>
          <hr />
          <div
      dangerouslySetInnerHTML={{ __html: selectedMail.content }}
      className='mail-content-html'
    ></div>
          {/* <p>{selectedMail.content}</p> */}
        </div>
      ) : (
        <p>Select a mail to view</p>
      )}
    </div>
    </div>
  );
}

export default Inbox;
