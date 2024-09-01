import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { usePoints } from '../context/PointsContext';
import UserInfo from './UserInfo';
import axios from 'axios';
import dollarImage from '../assets/dollar-homepage.png';

// Main container that centers the content vertically and horizontally
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(145deg, #11204f, #11204f);
  padding: 20px;
  color: #ffffff;
  font-family: Arial, sans-serif;
`;

const StickyUserInfo = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  background-color: #11204f;
  z-index: 1000;
  padding: 10px 0;
  display: flex;
  justify-content: center;
`;

const ReferralContainer = styled.div`
  background: linear-gradient(145deg, #1b346f, #1b346f);
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 500px;
  text-align: center;
  border-radius: 10px;
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

const DollarIcon = styled.img`
  width: 31px;
  height: 31px;
  margin-right: 8px;
`;

const Title = styled.h2`
  color: #ffffff;
  margin-bottom: 15px;
  font-size: 24px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const PointsNotice = styled.div`
  background-color: #1f4068;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #f5f5f5;
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

const ReferralList = styled.div`
  margin-top: 20px;
  text-align: left;
`;

const ReferralItem = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #1f4068;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const ReferralUsername = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
`;

const ReferralPoints = styled.div`
  font-size: 16px;
  color: #ffcc00;
`;

function FriendPage() {
  const { points, userID } = usePoints();
  const [referralLink, setReferralLink] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    if (userID) {
      setReferralLink(`https://t.me/IGHGamebot?ref=IGH${userID}`);
      // Fetch the list of referred users from the backend
      fetchReferrals(userID);
    }
  }, [userID]);

  const fetchReferrals = async (userID) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/referrals/${userID}`);
      setReferrals(response.data); // Assuming response.data is an array of referred users
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

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
      <StickyUserInfo>
        <UserInfo />
      </StickyUserInfo>
      <ReferralContainer>
        <PointsDisplayContainer>
          <PointsDisplay><DollarIcon src={dollarImage} alt="Dollar Icon" /> {Math.floor(points)}</PointsDisplay>
        </PointsDisplayContainer>

        <Title>Refer & Earn More Rewards!</Title>
        <PointsNotice>Refer more than 3 friends for additional surprises!</PointsNotice>

        <ReferralLinkContainer>
          <ReferralLink href={referralLink} target="_blank" rel="noopener noreferrer">
            {referralLink || 'Generating your referral link...'}
          </ReferralLink>
          <CopyButton onClick={handleCopyLink} disabled={!referralLink}>Copy Link</CopyButton>
          {copySuccess && <Notice>{copySuccess}</Notice>}
        </ReferralLinkContainer>

        <ReferralStats>
          <h3>Your Total Referrals: {referrals.length}</h3>
          <Notice>Keep sharing your link to earn more rewards!</Notice>
        </ReferralStats>

        <ReferralList>
          {referrals.map((referral, index) => (
            <ReferralItem key={index}>
              <ReferralUsername>{referral.username || 'Unknown User'}</ReferralUsername>
              <ReferralPoints>{Math.floor(referral.points)} pts</ReferralPoints>
            </ReferralItem>
          ))}
        </ReferralList>
      </ReferralContainer>
    </MainContainer>
  );
}

export default FriendPage;
