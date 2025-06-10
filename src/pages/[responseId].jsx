import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CandidateResponse from './CandidateResponse';
import { API_BASE_URL } from '../utils/constants';
import { useParams } from 'react-router-dom';

const CandidateResponsePage = () => {
  const { responseId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/responses/${responseId}`).then((res) => {
      if (res.data.success) {
        setData(res.data.data);
      }
    });
  }, []);

  return (
    <div>
      {data ? <CandidateResponse data={data} /> : <p className="p-8">Loading...</p>}
    </div>
  );
};

export default CandidateResponsePage;
