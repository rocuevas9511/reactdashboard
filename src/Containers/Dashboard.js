import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import HumanBody from '../Components/HumanBody'
import Card from '../Components/Card'
import axios from 'axios'
import { expression } from '@babel/template';

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
const SecondaryRow = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-evenly;
  width: 100%;
  padding-top: 25px;
`
const DashTitle = styled.h2`
  font-weight: 600;
  color: #303030;
`
const CardWrapper = styled.div`
  padding: 0px 5px;
`


const Dashboard = () => {
  const [loading, setLoad] = useState(true)
  const [data, setData] = useState({})
  let textSentiment = [],
    facialExpressions = [],
    expressionRate = [],
    cleanFE = {}


  const separateSentiments = (metrics) => {
    if (metrics && metrics.length > 0) {
      metrics.map((m) => {
        if (m.Metric.includes('Expression Rate')) {
          expressionRate = [...expressionRate, JSON.parse(m.Value)]
          // console.log(expressionRate)
        } else if (m.Metric.includes('Expression Count')) {
          facialExpressions = [...facialExpressions, JSON.parse(m.Value)]
          // console.log(facialExpressions)
        } else {
          textSentiment = [...textSentiment, m.Value]
          // console.log(textSentiment)
        }
      })
    }

    facialExpressions.map(expressions => {
      Object.keys(expressions).reduce((acc, fe) => {
        cleanFE[fe] = cleanFE[fe]
          ? cleanFE[fe] + expressions[fe]
          : expressions[fe]
      }, {})
    })
    // console.log(cleanFE, facialExpressions.length)
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
          :
          (<div>
            <DashRow>
              <DashboardGraphContainer>
                <HumanBody
                  textSentiment={textSentiment}
                  facialExpressions={facialExpressions}
                  expressionRate={expressionRate}
                />
              </DashboardGraphContainer>
            </DashRow>
            <SecondaryRow>
              <div style={{ paddingTop: "25px" }}></div>

              <CardWrapper>
                <Card
                  days="Past 25 days"
                  title="Happiness"
                  change="+24%"
                  type="happy"
                />
              </CardWrapper>

              <CardWrapper>
                <Card
                  days="Past 25 days"
                  title="Anger"
                  change="+4%"
                  type="anger"
                />
              </CardWrapper>

              <CardWrapper>
                <Card
                  days="Past 25 days"
                  title="Sadness"
                  change="-18%"
                  type="sad"
                />
              </CardWrapper>

              <CardWrapper>
                <Card
                  days="Past 25 days"
                  title="Satisfied"
                  change="+200%"
                  type="satisfied"
                />
              </CardWrapper>

            </SecondaryRow>


          </div>)

      }
    </DashboardContainer>
  )
}

export default Dashboard
