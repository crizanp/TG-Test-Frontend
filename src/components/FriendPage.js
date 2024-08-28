import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { usePoints } from '../context/PointsContext';
import UserInfo from './UserInfo';
import dollarImage from '../assets/dollar-homepage.png';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
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
  max-width: 400px;
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

function FriendPage() {
  const { points, userID, referrals } = usePoints();
  const [referralLink, setReferralLink] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    if (userID) {
      const baseLink = 'https://t.me/IGHGamebot?start=';
      setReferralLink(`${baseLink}${userID}`);
    }
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
          <h3>Your Total Referrals: {referrals}</h3>
          <Notice>Keep sharing your link to earn more rewards!</Notice>
        </ReferralStats>
      </ReferralContainer>
    </MainContainer>
  );
}

export default FriendPage;
