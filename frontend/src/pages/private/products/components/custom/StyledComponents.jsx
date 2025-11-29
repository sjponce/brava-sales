import styled from '@emotion/styled';
import { Box, Card, CardMedia, IconButton } from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  height: 140,
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.2s ease-in-out',
  border: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
    borderColor: theme.palette.primary.main,
    '& .edit-button': {
      opacity: 1,
      visibility: 'visible',
    },
  },
}));

const ImageContainer = styled(Box)({
  position: 'relative',
  width: 140,
  minWidth: 140,
  height: 140,
});

const StyledCardMedia = styled(CardMedia)({
  width: 140,
  height: 140,
  minWidth: 140,
  cursor: 'pointer',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const EditButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  opacity: 0,
  visibility: 'hidden',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    transform: 'scale(1.1)',
  },
}));

export { StyledCard, ImageContainer, StyledCardMedia, EditButton };
