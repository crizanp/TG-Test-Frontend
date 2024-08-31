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

const PointsDisplay = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #ffcc00;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ReferralLink = styled.a`
  background-color: #162447; 
  padding: 10px;
  border-radius: 8px;
  display: inline-block;
  margin-top: 15px;
  word-break: break-all;
  color: #ffffff;
  font-size: 14px;
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
  const [userID, setUserID] = useState(null);
  const [points, setPoints] = useState(0);
  const [referralLink, setReferralLink] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    const getUserID = async () => {
      const tgUserID = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
      if (tgUserID) {
        setUserID(tgUserID);
      } else {
        console.error('User ID not available from Telegram.');
      }
    };

    getUserID();
  }, []);

  useEffect(() => {
    if (userID) {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`);
          setPoints(response.data.points);
          setReferralLink(`https://t.me/cizantest_bot?start=${userID}`);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };

      const fetchReferralStats = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/referrals/stats/${userID}`);
          setReferralCount(response.data.referralCount);
        } catch (error) {
          console.error('Error fetching referral stats:', error);
        }
      };

      fetchUserInfo();
      fetchReferralStats();
    }
  }, [userID]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopySuccess('Referral link copied!');
      setTimeout(() => setCopySuccess(''), 3000);
    }).catch(() => {
      setCopySuccess('Failed to copy.');
      setTimeout(() => setCopySuccess(''), 3000);
    });
  };

  return (
    <MainContainer>
      <ReferralContainer>
        <PointsDisplay>{points} Points</PointsDisplay>

        <Title>Refer & Earn More Rewards!</Title>

        <ReferralLink href={referralLink} target="_blank" rel="noopener noreferrer">
          {referralLink || 'Generating your referral link...'}
        </ReferralLink>
        <CopyButton onClick={handleCopyLink} disabled={!referralLink}>Copy Link</CopyButton>
        {copySuccess && <Notice>{copySuccess}</Notice>}

        <ReferralStats>
          <h3>Your Total Referrals: {referralCount}</h3>
          <Notice>Keep sharing your link to earn more rewards!</Notice>
        </ReferralStats>
      </ReferralContainer>
    </MainContainer>
  );
};

export default FriendPage;
