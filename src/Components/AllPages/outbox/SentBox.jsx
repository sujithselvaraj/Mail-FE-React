import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LeftSideBar from '../../LeftSideRouteBar/LeftSideBar';
import './SentBox.css'
import Navbar from '../Navbar/Navbar';
import { format } from 'date-fns';

function SentBox() {
  const [sentMails, setSentMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMail, setSelectedMail] = useState(null);
  const [selectedMailId, setSelectedMailId] = useState(null);


  const [currentPage, setCurrentPage] = useState(1);
  const sentMailsPerPage = 16; 
  const indexOfLastSentMail = currentPage * sentMailsPerPage;
  const indexOfFirstSentMail = indexOfLastSentMail - sentMailsPerPage;
  const currentSentMails = sentMails.slice(indexOfFirstSentMail, indexOfLastSentMail);
    

  

  useEffect(() => {
    fetchSentMails();
  }, []);

  const fetchSentMails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/mails/get-send-emails', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSentMails(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching sent mails.');
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
    <div className='SentBox'>
      <Navbar/>
      <div className="Mail-List">
      <LeftSideBar/>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
      {currentSentMails.map((mail) => (
          <li key={mail.id} className={mail.id === selectedMailId ? 'selected-mail' : ''}
          onClick={() => handleViewMail(mail.id)}>
            <div className='div'>
            <p className='recipients'>{mail.recipients}</p>
            <p className='subject'>{mail.subject}</p>
            <p>{format(new Date(mail.time), 'MMM d')}</p>

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
    disabled={indexOfLastSentMail >= sentMails.length}
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
          <p>Recipients: {selectedMail.recipients.join(', ')}</p>
          <hr />
          <div
      dangerouslySetInnerHTML={{ __html: selectedMail.content }}
      className='mail-content-html'
    ></div>
        </div>
      ) : (
        <p>Select a mail to view</p>
      )}
    </div>
    </div>
  );
}

export default SentBox;
