import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import { debounce } from "lodash";
import UserInfo from './UserInfo';
import dollarImage from '../assets/dollar-homepage.png';

// Styled components for better UI/UX
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(145deg, #0a2b4e, #1a3e68);
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
  animation: fadeIn 1s ease-in-out;
  margin-top: 20px;
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
  justify-content: center;
  margin-top: 10px;
`;

const DollarIcon = styled.img`
  width: 30px;
  margin-right: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
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
  transition: background-color 0.3s;

  &:hover {
    text-decoration: underline;
    background-color: #1e4d85;
  }
`;

const CopyButton = styled.button`
  background-color: #ffcc00;
  color: #1f4068;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e6b800;
  }
`;

const ForwardButton = styled.button`
  background-color: #00c1ff;
  color: #1f4068;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #00a7d1;
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

const StickyUserInfoContainer = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  background: #11204f;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding: 10px 0;
  text-align: center;
`;

const FriendPage = () => {
  const [userID, setUserID] = useState(null);
  const [points, setPoints] = useState(0);
  const [referralLink, setReferralLink] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const getUserID = async () => {
      const tgUserID = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
      if (tgUserID) {
        setUserID(tgUserID);
      } else {
        console.error("User ID not available from Telegram.");
      }
    };

    getUserID();
  }, []);

  const fetchUserInfo = useCallback(
    debounce(async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user-info/${userID}`);
        setPoints(response.data.points);
        setReferralLink(`https://t.me/cizantest_bot?start=${userID}`);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }, 1000), [userID]);

  const fetchReferralStats = useCallback(
    debounce(async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/referrals/stats/${userID}`);
        setReferralCount(response.data.referralCount);
        setReferrals(response.data.referrals);
      } catch (error) {
        if (error.response && error.response.status === 409) {
          console.warn("Conflict detected. Retrying...");
          setTimeout(fetchReferralStats, 1000); // Retry after 1 second
        } else {
          console.error("Error fetching referral stats:", error);
        }
      }
    }, 1000), [userID]);

  useEffect(() => {
    if (userID) {
      fetchUserInfo();
      fetchReferralStats();
    }
  }, [userID, fetchUserInfo, fetchReferralStats]);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        setCopySuccess("Referral link copied!");
        setTimeout(() => setCopySuccess(""), 3000);
      })
      .catch(() => {
        setCopySuccess("Failed to copy.");
        setTimeout(() => setCopySuccess(""), 3000);
      });
  };

  const handleForwardLink = () => {
    // Open Telegram's forwarding dialog for the referral link
    const inviteLink = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Join%20and%20earn%20rewards!`;
    window.Telegram.WebApp?.openTelegramLink(inviteLink);
  };

  return (
    <MainContainer>
      <StickyUserInfoContainer>
        <PointsDisplay>
          <DollarIcon src={dollarImage} alt="Dollar Icon" />
          {Math.floor(points)}
        </PointsDisplay>
      </StickyUserInfoContainer>

      <ReferralContainer>
        <Title>Refer & Earn More Rewards!</Title>

        <ReferralLink
          href={referralLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {referralLink || "Generating your referral link..."}
        </ReferralLink>

        <ButtonGroup>
          <CopyButton onClick={handleCopyLink} disabled={!referralLink}>
            Copy Link
          </CopyButton>
          <ForwardButton onClick={handleForwardLink} disabled={!referralLink}>
            Forward in Telegram
          </ForwardButton>
        </ButtonGroup>

        {copySuccess && <Notice>{copySuccess}</Notice>}

        <ReferralStats>
          <h3>Your Total Referrals: {referralCount}</h3>
          <Notice>Keep sharing your link to earn more rewards!</Notice>
        </ReferralStats>

        <ReferralList>
          {referrals.map((referral, index) => (
            <ReferralItem key={index}>
              <ReferralUsername>
                {referral.username || "Unknown User"}
              </ReferralUsername>
              <ReferralPoints>
                {Math.floor(referral.pointsAwarded)} pts
              </ReferralPoints>
            </ReferralItem>
          ))}
        </ReferralList>
      </ReferralContainer>
    </MainContainer>
  );
};

export default FriendPage;
