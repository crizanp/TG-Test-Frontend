import React from 'react';
import styled from 'styled-components';

const FriendContainer = styled.div`
  color: white;
  background-color: #121212;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const FriendTitle = styled.h2`
  color: #ff9800;
`;

const ReferralDetails = styled.div`
  margin-top: 20px;
  font-size: 18px;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const ReferralPoints = styled.div`
  font-weight: bold;
  margin-top: 10px;
`;

function FriendPage() {
  const totalReferrals = 10;
  const referralPoints = 100;

  return (
    <FriendContainer>
      <FriendTitle>Refer & Earn</FriendTitle>
      <p>Invite your friends and earn rewards!</p>
      <ReferralDetails>Total Referrals: {totalReferrals}</ReferralDetails>
      <ReferralPoints>Points Earned: {referralPoints} pts</ReferralPoints>
    </FriendContainer>
  );
}

export default FriendPage;
