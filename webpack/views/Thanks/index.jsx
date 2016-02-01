import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'redux-simple-router';

import './style.css';

class Thanks extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    store: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  };
  render = () => {
    const { push, location } = this.props;
    const button = <Button
      bsClass="btn"
      bsStyle="primary"
      onClick={() => push('/')}>
      ★GO HOME★
    </Button>;
    return (
      <section id="thanks">
        <div className="container">
          {(function () {
            switch(location.query.type) {
              case 'CreateUser':
                return <div>
                  <p>
                    Thanks for registering! Check your email.
                  </p>
                  <p>
                    A verification message has been sent and must be completed before you can login.
                  </p>
                  {button}
                </div>;
              case 'ChangePassword':
                return <div>
                  <p>
                    Thanks for changing your password. Please login again using your new password.
                  </p>
                  {button}
                </div>;
              case 'LostPassword':
                return <div>
                  <p>
                    We've sent you a reset link! Check your email.
                  </p>
                  <p>
                    A reset link as been sent to the email you provided. If you don't get it please check your spam folder.
                  </p>
                  {button}
                </div>;
              case 'ResetPassword':
                return <div>
                  <p>
                    Completed!
                  </p>
                  <p>
                    Congratulations, your password has been reset :)
                  </p>
                  {button}
                </div>;
              default:
                return <div>
                  <p>
                    Everyone should be thanked for something at least.
                  </p>
                  <p>
                    So... in the name of happiness and all things fuzzy; Thanks!
                  </p>
                  {button}
                </div>;
            }
          })()}
        </div>
      </section>
    );
  };
}

const mapStateToProps = (state) => {
  const { store } = state;
  const { data, session } = store;
  const { isAuthenticated } = session;
  return {
    isAuthenticated,
    isFetching: data.isFetching || session.isFetching,
    store
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    push: bindActionCreators(routeActions.push, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Thanks);
