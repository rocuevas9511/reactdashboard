import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import HumanBody from '../Components/HumanBody'

import axios from 'axios'

const DashboardContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  background: #F0F0F0;
  color: #000000;
  font-weight: 600;
  height: 100vh;
  overflow-y: hidden;
  align-items: center;
`
const DashboardGraphContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  height: 100%;
  width: 30%;
  background: #F4F4FC;
  padding: 5px;
  &:hover {
    box-shadow: 7px 11px 23px -9px rgba(180,180,180,1);
  }
`
const DashRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-content: center;
  justify-content: space-evenly;
`
const DashTitle = styled.h2`
  font-weight: 600;
  color: #303030;
`


const Dashboard = () => {
  const [loading, setLoad] = useState(true)
  const [data, setData] = useState({}) 
  let textSentiment = []
    , facialExpressions = []
    , expressionRate = []
  
  const separateSentiments = (metrics) => {
    if (metrics && metrics.length > 0) {
      metrics.map((m) => {
        if (m.Metric.includes('Expression Rate')) {
          expressionRate = [...expressionRate, JSON.parse(m.Value)]
          // console.log(expressionRate)
        } else if (m.Metric.includes('Expression Count')) {
          facialExpressions = [...facialExpressions, m.Value]
          // console.log(facialExpressions)
        } else {
          textSentiment = [...textSentiment, m.Value]
          // console.log(textSentiment)
        }
      })
    }
  }

  useEffect(() => (
    axios.get('https://carebotdashboards.azurewebsites.net/satisfaction')
          .then(res => {
            return setData(res.data)
          })
          .catch(err => console.log(err))
          .finally(() => setLoad(false))
  ), [])

  separateSentiments(data)
  // console.log(expressionRate)
  return (
    <DashboardContainer>
      <DashTitle>
        {'Site Emotional Status Dashboard'}
      </DashTitle>
      {
        loading
        ? `Loading...`
        : <DashRow>
          <DashboardGraphContainer>
            <HumanBody 
              textSentiment={textSentiment}
              facialExpressions={facialExpressions}
              expressionRate={expressionRate}
            />
          </DashboardGraphContainer>
        </DashRow>
      }
    </DashboardContainer>
  )
}

export default Dashboard
