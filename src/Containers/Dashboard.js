import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import HumanBody from '../Components/HumanBody'
import Card from '../Components/Card'
import axios from 'axios'
import gaugeImg from '../Resources/credit-score-range.png'

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
const DashColumn = styled.div`
  display: flex;
  flex: 1;
  align-self: center;
  align-items: space-between;
  flex-direction: column;
  align-content: center;
  justify-items: center;
  justify-content: space-evenly;
  overflow-y: hidden;
  margin-left: 5%;
  margin-right: 5%;
  height: 100%;
  padding: 1em;
  &:hover {
    overflow-y: ${props => !props.fixed ? 'scroll' : 'hidden'}
  }
`
const DashRow = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-evenly;
  width: 100%;
  flex: 1;
  max-height: 80vh;
`
const DashTitle = styled.h2`
  font-weight: 600;
  color: #303030;
`
const CardWrapper = styled.div`
  padding: 0px 5px;
  margin: 1em;
`

const GaugeContainer = styled.div`
  margin: 1%;
  display: flex;
  align-self: center;
  justify-content: center;
  height: 125px;
  width: 250px;
  background: url(${gaugeImg});
  background-repeat: no-repeat;
  background-size: contain;
`

const Gauge = styled.div`
  width: 8px;
  height: 90%;
  transform: rotate(${props => props.rotate || 0}deg);
  transform-origin: 50% 100%;
  background: black;
`

const Dashboard = () => {
  const [loading, setLoad] = useState(true)
  const [data, setData] = useState({})
  let textSentiment = [],
    facialExpressions = [],
    expressionRate = [],
    cleanFE1 = {},
    cleanFE2 = {},
    sentiments = 0.5

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

    facialExpressions.map((expressions, i) => {
      Object.keys(expressions).reduce((acc, fe) => {
        if (i < facialExpressions.length / 2) {
          cleanFE1[fe] = cleanFE1[fe]
            ? cleanFE1[fe] + expressions[fe]
            : expressions[fe]
        } else {
          cleanFE2[fe] = cleanFE2[fe]
            ? cleanFE2[fe] + expressions[fe]
            : expressions[fe]
        }

      }, {})
    })

    sentiments = textSentiment
      ? textSentiment.length > 0
        ? textSentiment.reduce((acc, curr) => acc + curr, 0) / textSentiment.length
        : 0
      : 0

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
          (
            <DashRow>
              <DashColumn fixed>
                <HumanBody
                  textSentiment={textSentiment}
                  facialExpressions={cleanFE1}
                  expressionRate={expressionRate}
                  size='medium'
                />
                <GaugeContainer>
                  <Gauge rotate={(sentiments * 180) - 90} />
                </GaugeContainer>
              </DashColumn>
              <DashColumn>
                {
                  Object.keys(cleanFE1).map(exp => {
                    const calc = 1 - (cleanFE1[exp] / cleanFE2[exp]) * 100

                    return (
                    <CardWrapper key={exp}>
                      <Card
                        days="Past 25 days"
                        title={exp}
                        change={`${isNaN(calc) ? 0 : calc.toFixed(2)} %`}
                        type={exp.toLowerCase()}
                      />
                    </CardWrapper>
                  )})
                }
              </DashColumn>
            </DashRow>
          )

      }
    </DashboardContainer>
  )
}

export default Dashboard
