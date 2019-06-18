import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import SmileIcon from '@material-ui/icons/Mood'
import MoodBad from '@material-ui/icons/MoodBad'
import Sentimental from '@material-ui/icons/SentimentVeryDissatisfiedOutlined'
import Satisfied from '@material-ui/icons/SentimentSatisfied'

const useStyles = makeStyles({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});





export default function SimpleCard( props ) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const { title, days, change, type  } = props;

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {days}
        </Typography>
        <Typography variant="h5" component="h2">
          {
            type === 'happiness' ? <SmileIcon></SmileIcon> : null
          }
          {
            type === 'anger' ? <MoodBad></MoodBad> : null
          }
          {
            type === 'sadness' ? <Sentimental></Sentimental> : null
          }
          {
            type === 'neutral' ? <Satisfied></Satisfied> : null
          }
          {" "}{title}
          {bull}
          {change}
        </Typography>
        
        {/* <Typography variant="body2" component="p">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography> */}
      </CardContent>
      <CardActions>
        {/* <Button size="small">Learn More</Button> */}
      </CardActions>
    </Card>
  );
}