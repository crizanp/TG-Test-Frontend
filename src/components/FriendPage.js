import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled components for better UI/UX
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(145deg, #11204f, #1b346f);
  padding: 20px;
  color: #ffffff;
  font-family: Arial, sans-serif;
`;

const ReferralContainer = styled.div`
  background: linear-gradient(145deg, #1b346f, #11204f);
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 400px;
  text-align: center;
  border-radius: 10px;
`;

const Title = styled.h2`
  color: #ffffff;
  margin-bottom: 15px;
  font-size: 24px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const PointsDisplayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const PointsDisplay = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #ffcc00;
  display: flex;
  align-items: center;
`;

const ReferralLinkContainer = styled.div`
  margin-top: 15px;
`;

const ReferralLink = styled.a`
  background-color: #162447; 
  padding: 10px;
  border-radius: 8px;
  display: inline-block;
  margin: 0;
  word-break: break-all;
  color: #ffffff;
  font-size: 14px;
  letter-spacing: 0.5px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CopyButton = styled.button`
  background-color: #ffcc00;
  color: #1f4068;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e6b800;
  }
`;

const Notice = styled.p`
  margin-top: 10px;
  font-size: 14px;
  color: #f5f5f5; 
`;

const ReferralStats = styled.div`
  margin-top: 20px;
  color: #ffcc00;
`;

const FriendPage = () => {
  const [userID, setUserID] = useState(null); // Assume you have a way to get the current user's ID
  const [points, setPoints] = useState(0); // Current user's points
  const [referralLink, setReferralLink] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [referralCount, setReferralCount] = useState(0); // State to hold referral count

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user-info/${userID}`);
        setPoints(response.data.points);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
  
    const fetchReferralLink = async () => {
      if (userID) {
        try {
          setReferralLink(`https://t.me/cizantest_bot?start=${userID}`);
          fetchUserInfo();
        } catch (error) {
          console.error('Error generating referral link:', error);
        }
      }
    };
  
    const fetchReferralStats = async () => {
      if (userID) { // Ensure userID is not null before making the call
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/referrals/stats/${userID}`);
          setReferralCount(response.data.referralCount);
        } catch (error) {
          console.error('Error fetching referral stats:', error);
        }
      } else {
        console.error('userID is null, skipping fetchReferralStats');
      }
    };
  
    const getUserID = async () => {
      const tgUserID = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
      if (tgUserID) {
        setUserID(tgUserID);
        fetchReferralLink();
        fetchReferralStats();
      } else {
        console.error('User ID not available from Telegram.');
      }
    };
  
    getUserID();
  }, [userID]);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopySuccess('Referral link copied!');
      setTimeout(() => setCopySuccess(''), 3000);
    }, () => {
      setCopySuccess('Failed to copy.');
      setTimeout(() => setCopySuccess(''), 3000);
    });
  };

  return (
    <MainContainer>
      <ReferralContainer>
        <PointsDisplayContainer>
          <PointsDisplay>{Math.floor(points)} Points</PointsDisplay>
        </PointsDisplayContainer>

        <Title>Refer & Earn More Rewards!</Title>

        <ReferralLinkContainer>
          <ReferralLink href={referralLink} target="_blank" rel="noopener noreferrer">
            {referralLink || 'Generating your referral link...'}
          </ReferralLink>
          <CopyButton onClick={handleCopyLink} disabled={!referralLink}>Copy Link</CopyButton>
          {copySuccess && <Notice>{copySuccess}</Notice>}
        </ReferralLinkContainer>

        <ReferralStats>
          <h3>Your Total Referrals: {referralCount}</h3> {/* Display referral count */}
          <Notice>Keep sharing your link to earn more rewards!</Notice>
        </ReferralStats>
      </ReferralContainer>
    </MainContainer>
  );
};

export default FriendPage;
