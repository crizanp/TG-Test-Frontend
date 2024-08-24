import React, { useState } from 'react';
import styled from 'styled-components';
import { usePoints } from '../context/PointsContext';

const ReferralContainer = styled.div`
  color: #ffffff;
    font-family: Arial, sans-serif;
    background: linear-gradient(145deg, #11204f, #11204f);
    padding: 20px;
    /* border-radius: 15px; */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    width: 90%;
    max-width: 400px;
    margin: 25% auto;
    text-align: center;
`;

const Title = styled.h2`
  color: #ffcc00; /* Bright yellow for the title */
  margin-bottom: 15px;
  font-size: 24px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const PointsNotice = styled.div`
  background-color: #1f4068; /* Deep blue for contrast */
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #f5f5f5; /* Light grey text */
`;

const ReferralLinkContainer = styled.div`
  margin-top: 15px;
`;

const ReferralLink = styled.p`
  background-color: #162447; /* Darker blue for the referral link */
  padding: 10px;
  border-radius: 8px;
  display: inline-block;
  margin: 0;
  word-break: break-all;
  color: #ffffff;
  font-size: 14px;
  letter-spacing: 0.5px;
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
  color: #f5f5f5; /* Light grey text */
`;

const ReferralStats = styled.div`
  margin-top: 20px;
  color: #ffcc00; /* Match the accent color */
`;

function ReferralPage() {
  const { userID } = usePoints();
  const [referralLink] = useState(`${window.location.origin}/?ref=IGH${userID}`);
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopySuccess('Referral link copied!');
      setTimeout(() => setCopySuccess(''), 3000);
    }, () => {
      setCopySuccess('Failed to copy.');
      setTimeout(() => setCopySuccess(''), 3000);
    });
  };

  const totalReferrals = 3; // Replace with actual logic to get total referrals from backend

  return (
    <ReferralContainer>
      <Title>Refer & Earn More Rewards!</Title>
      <PointsNotice>Refer more than 3 friends for additional surprice!</PointsNotice>

      <ReferralLinkContainer>
        <ReferralLink>{referralLink}</ReferralLink>
        <CopyButton onClick={handleCopyLink}>Copy Link</CopyButton>
        {copySuccess && <Notice>{copySuccess}</Notice>}
      </ReferralLinkContainer>

      <ReferralStats>
        <h3>Your Total Referrals: {totalReferrals}</h3>
        <Notice>Keep sharing your link to earn more rewards!</Notice>
      </ReferralStats>
    </ReferralContainer>
  );
}

export default ReferralPage;
