// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Inbox.css';
// import { format } from 'date-fns';

// import LeftSideBar from '../../LeftSideRouteBar/LeftSideBar';
// import Navbar from '../Navbar/Navbar';
// import trash from '/Users/grootan/Downloads/hit-mail/src/assests/trash.svg';

// function Inbox() {
//   const [receivedMails, setReceivedMails] = useState([]);
//   const [selectedMail, setSelectedMail] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedMailId, setSelectedMailId] = useState(null);


//   useEffect(() => {
//     fetchReceivedMails();
//   }, []);

//   const fetchReceivedMails = async () => {
//     try {
//       const token = localStorage.getItem('token'); 
//       console.log(token);
  
//       const response = await axios.get('http://localhost:8080/mails/received-mails', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
  
//       console.log('Response:', response.data); // Log the response data
//       setReceivedMails(response.data.data.reverse()); // Assuming the data field contains the list of received mails
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching received mails:', error); // Log any errors
//       setError('Error fetching received mails.');
//       setLoading(false);
//     }
//   };

//   const handleViewMail = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`http://localhost:8080/mails/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       setSelectedMail(response.data);
//       setSelectedMailId(id); 
//     } catch (error) {
//       console.error('Error fetching mail details:', error);
//       setError('Error fetching mail details.');
//     }
//   };


  


//   const handleDeleteMail = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       console.log(id);

//       await axios.delete(`http://localhost:8080/mails/delete/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       // Remove the deleted mail from the list
//       setReceivedMails(receivedMails.filter(mail => mail.id !== id));
//     } catch (error) {
//       console.error('Error deleting mail:', error);
//       setError('Error deleting mail.');
//     }
//   };
//   return (
//     <div className='Inbox'>
//       <Navbar/>
//       <LeftSideBar/>
//       {loading && <p>Loading...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
      

// <ul>
// {receivedMails.map((mail) => (
//   <li key={mail.id}  className={mail.id === selectedMailId ? 'selected-mail' : ''}>
//     <div onClick={() => handleViewMail(mail.id)}>
//       <p>{mail.sender}</p>
//       <p>{mail.subject}</p>
//       <p>{format(new Date(mail.time), 'MMM d')}</p>
//       <button onClick={() => handleDeleteMail(mail.id)} style={{border:"none"}} className='del'>        <img src={trash} alt="Globe" width="18px" style={{opacity: "0.7"}}/>
// </button>
//     </div>
//   </li>
// ))}
// </ul>

     

//       {selectedMail && (
//         <div className='Viewing-mail'>  
//           <h2>Viewing Mail</h2>
//           <p>Sender: {selectedMail.sender}</p>
//           <p>Subject: {selectedMail.subject}</p>
//           <p>Content: {selectedMail.content}</p>
//           {/* Add other mail details as needed */}
//         </div>
//       )}
      
//     </div>
//   );
// }

// export default Inbox;
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
        {receivedMails.map((mail) => (
          <li
            key={mail.id}
            className={mail.id === selectedMailId ? 'selected-mail' : ''}
            onClick={() => handleViewMail(mail.id)}
          >
            <div>
              <p>{mail.sender}</p>
              <p>{mail.subject}</p>
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
      </div>
      <div className='Viewing-Mail'>

      {selectedMail ? (
      <div>
        <h2>Viewing Mail</h2>
        <p>Sender: {selectedMail.sender}</p>
        <p>Subject: {selectedMail.subject}</p>
        <p>Content: {selectedMail.content}</p>
        <p>Time: {format(new Date(selectedMail.time), 'MMM d hh:mm a')}</p>
      </div>
    ) : (
      <p>Select a mail to view</p>
    )}
      </div>
    </div>
  );
}

export default Inbox;
