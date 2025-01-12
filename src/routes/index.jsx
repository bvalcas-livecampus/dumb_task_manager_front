import { Navigate } from 'react-router';
import PropTypes from 'prop-types';
export default function RedirectTo({ path }) {
  return <Navigate to={path} replace />;
}

RedirectTo.propTypes = {
  path: PropTypes.string.isRequired
};
