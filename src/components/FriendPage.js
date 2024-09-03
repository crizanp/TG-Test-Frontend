import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import { debounce } from "lodash";
import dollarImage from '../assets/dollar-homepage.png';

// Styled components with a professional, darkish blue color theme
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(145deg, #0d1b2a, #1b263b);
  padding: 30px 20px;
  color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const PointsDisplayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  padding: 20px 40px;
  background: linear-gradient(145deg, #1b263b, #0d1b2a);
  border-radius: 50px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.4);
`;

const PointsDisplay = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: #00b4d8;
  display: flex;
  align-items: center;
`;

const DollarIcon = styled.img`
  width: 36px;
  margin-right: 15px;
`;

const TaskCategory = styled.div`
  width: 100%;
  max-width: 650px;
  background-color: #1e3a5f;
  padding: 25px;
  margin-bottom: 35px;
  border-radius: 15px;
  color: #ffffff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const TaskTitle = styled.h3`
  color: #90e0ef;
  margin-bottom: 20px;
  margin-top: 0;
  font-weight: bold;
  font-size: 22px;
  text-transform: uppercase;
`;

const TaskItem = styled.div`
  background-color: #123047;
  padding: 20px;
  margin: 15px 0;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
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
  font-size: 20px;
  color: #ffffff;
  margin-bottom: 8px;
  font-weight: bold;
`;

const TaskPoints = styled.div`
  background-color: #00b4d8;
  color: white;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 18px;
`;

const ReferralContainer = styled.div`
  background: linear-gradient(145deg, #0d1b2a, #1b263b);
  padding: 30px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 650px;
  text-align: center;
  border-radius: 15px;
  animation: fadeIn 1s ease-in-out;
`;

const Title = styled.h2`
  color: #ffffff;
  margin-bottom: 25px;
  font-size: 26px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ReferralLink = styled.a`
  background-color: #163a59;
  padding: 15px;
  border-radius: 12px;
  display: inline-block;
  margin-top: 20px;
  word-break: break-all;
  color: #ffffff;
  font-size: 15px;
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    text-decoration: underline;
    background-color: #1d4b70;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 20px;
`;

const CopyButton = styled.button`
  background-color: #00b4d8;
  color: #0d1b2a;
  border: none;
  padding: 12px 30px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0096c7;
  }
`;

const ForwardButton = styled.button`
  background-color: #0077b6;
  color: #ffffff;
  border: none;
  padding: 12px 30px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005f8e;
  }
`;

const Notice = styled.p`
  margin-top: 10px;
  font-size: 15px;
  color: #ced4da;
`;

const ReferralStats = styled.div`
  margin-top: 35px;
  color: #00b4d8;
`;

const ReferralList = styled.div`
  margin-top: 25px;
  text-align: left;
`;

const ReferralItem = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #123047;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const ReferralUsername = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
`;

const ReferralPoints = styled.div`
  font-size: 16px;
  color: #00b4d8;
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
