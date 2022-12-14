import { makeStyles, Theme, createStyles } from '@material-ui/core';

export const useStyles = makeStyles((t: Theme) =>
  createStyles({
    root: {},
    predict: {
      padding: t.spacing(0.5, 0, 1.75),
      display: 'flex',
      justifyContent: 'space-between',
    },
    predictValue: {
      color: t.palette.primary.main,
      fontWeight: t.typography.fontWeightBold,
      fontSize: '1.35rem',
    },
    predictLabel: {
      fontSize: '0.95rem',
      lineHeight: 1.2,
      color: '#48484a',
    },
    helpText: {
      color: t.palette.text.secondary,
      fontSize: '0.9rem',
      margin: t.spacing(0.5, 1, 1, 1),
    },
    label: {
      color: 'rgba(166, 167, 177, 1)',
      textTransform: 'uppercase',
      fontWeight: 600,
      fontSize: 12,
      lineHeight: '18px',
      letterSpacing: 0.8,
      marginBottom: t.spacing(0.5),
    },
    switchableTextField: {
      position: 'relative',
    },
    switch: {
      position: 'absolute',
      right: t.spacing(2),
      top: '53%',
      transform: 'translateY(-50%)',
    },
    backButton: {
      marginRight: t.spacing(1),
      color: t.palette.text.hint,
      border: `1px solid ${t.palette.divider}`,
      borderRadius: t.shape.borderRadius,
      padding: 11,
    },
  }),
);
