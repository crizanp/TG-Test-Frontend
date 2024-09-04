import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import { debounce } from "lodash";
import dollarImage from '../assets/dollar-homepage.png';

// Styled components with a minimalist dark theme
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: #0d0d0d;
  padding: 30px 20px;
  color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const PointsDisplayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding: 15px 30px;
  background: #1a1a1a;
  border-radius: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
`;

const PointsDisplay = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
  display: flex;
  align-items: center;
`;

const DollarIcon = styled.img`
  width: 32px;
  margin-right: 12px;
`;

const TaskCategory = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #1a1a1a;
  padding: 20px;
  margin-bottom: 25px;
  border-radius: 12px;
  color: #e0e0e0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
`;

const TaskTitle = styled.h3`
  color: #e0e0e0;
  margin-bottom: 15px;
  margin-top: 0;
  font-weight: bold;
  font-size: 20px;
  text-transform: uppercase;
`;

const TaskItem = styled.div`
  background-color: #2b2b2b;
  padding: 15px;
  margin: 10px 0;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.5);
  }
`;

const TaskDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TaskItemTitle = styled.div`
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 5px;
  font-weight: bold;
`;

const TaskPoints = styled.div`
  background-color: #333333;
  color: white;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 16px;
`;

const ReferralContainer = styled.div`
  background: #1a1a1a;
  padding: 25px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 600px;
  text-align: center;
  border-radius: 12px;
  animation: fadeIn 1s ease-in-out;
`;

const Title = styled.h2`
  color: #ffffff;
  margin-bottom: 20px;
  font-size: 24px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ReferralLink = styled.a`
  background-color: #2b2b2b;
  padding: 12px;
  border-radius: 10px;
  display: inline-block;
  margin-top: 15px;
  word-break: break-all;
  color: #ffffff;
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3a3a3a;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 15px;
`;

const CopyButton = styled.button`
  background-color: #333333;
  color: #ffffff;
  border: none;
  padding: 10px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4d4d4d;
  }
`;

const ForwardButton = styled.button`
  background-color: #4a4a4a;
  color: #ffffff;
  border: none;
  padding: 10px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5a5a5a;
  }
`;

const Notice = styled.p`
  margin-top: 8px;
  font-size: 14px;
  color: #d0d0d0;
`;

const ReferralStats = styled.div`
  margin-top: 30px;
  color: #ffffff;
`;

const ReferralList = styled.div`
  margin-top: 20px;
  text-align: left;
`;

const ReferralItem = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #2b2b2b;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
`;

const ReferralUsername = styled.div`
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
`;

const ReferralPoints = styled.div`
  font-size: 15px;
  color: #ffffff;
`;

const StickyUserInfoContainer = styled.div`
  top: 0;
  width: 100%;
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
  const [isPremium, setIsPremium] = useState(false);

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
        const userData = response.data;
        setPoints(userData.points);
        setIsPremium(userData.isPremium);  // Assuming your API returns a boolean field 'isPremium'
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
    const inviteLink = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Join%20and%20earn%20rewards!`;
    window.Telegram.WebApp?.openTelegramLink(inviteLink);
  };

  return (
    <MainContainer>
      <StickyUserInfoContainer>
        <PointsDisplayContainer>
          <PointsDisplay>
            <DollarIcon src={dollarImage} alt="Dollar Icon" />
            {Math.floor(points)}
          </PointsDisplay>
        </PointsDisplayContainer>
      </StickyUserInfoContainer>

      <TaskCategory>
        <TaskTitle>Referral Tasks</TaskTitle>
        <TaskItem>
          <TaskDetails>
            <TaskItemTitle>Refer to Premium Profile</TaskItemTitle>
            <TaskPoints>3000 pts</TaskPoints>
          </TaskDetails>
        </TaskItem>
        <TaskItem>
          <TaskDetails>
            <TaskItemTitle>Refer to Non-Premium User</TaskItemTitle>
            <TaskPoints>2000 pts</TaskPoints>
          </TaskDetails>
        </TaskItem>
      </TaskCategory>

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
