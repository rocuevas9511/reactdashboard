import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import CarebotLogo from '../Resources/Carebot-Logo.png'
import Card from '../Components/Card'
import Dashboard from '../Containers/Dashboard'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    overflowY: 'hidden !important',
    height: '100vh'
  },
  appBar: {
    width: '100%'
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(4)
  },
}));

export default function PermanentDrawerRight() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <img style={{marginRight: '1%'}}src={CarebotLogo}/>
          <Typography variant="h6" noWrap>
            Carebot analytics
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Dashboard />
      </main>
    </div>
  );
}
