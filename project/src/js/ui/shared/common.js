import menu from '../menu';
import * as utils from '../../utils';
import helper from '../helper';
import gamesMenu from '../gamesMenu';
import newGameForm from '../newGameForm';
import settings from '../../settings';
import session from '../../session';
import challengesApi from '../../lichess/challenges';
import friendsApi from '../../lichess/friends';
import i18n from '../../i18n';
import friendsPopup from '../friendsPopup';
import m from 'mithril';
import ViewOnlyBoard from './ViewOnlyBoard';

export function menuButton() {
  return (
    <button key="main-menu" className="fa fa-navicon main_header_button menu_button" config={helper.ontouch(menu.toggle)}>
    </button>
  );
}

export function backButton(title) {
  return (
    <button key="default-history-backbutton" className="back_button main_header_button" config={helper.ontouch(utils.backHistory)}>
      <span className="fa fa-arrow-left"/>
      {title ? <div className="title">{title}</div> : null }
    </button>
  );
}

export function friendsButton() {
  const nbFriends = friendsApi.count();
  const longAction = () => window.plugins.toast.show(i18n('onlineFriends'), 'short', 'top');
  return (
    <button className="main_header_button friends_button" key="friends" data-icon="f"
      config={helper.ontouch(friendsPopup.open, longAction)}
    >
    {nbFriends > 0 ?
      <span className="chip nb_friends">{nbFriends}</span> : null
    }
    </button>
  );
}

export function gamesButton() {
  let key, action;
  const nbChallenges = challengesApi.all().length;
  const nbIncomingChallenges = challengesApi.incoming().length;
  const withOfflineGames = !utils.hasNetwork() && utils.getOfflineGames().length;
  if (session.nowPlaying().length || nbChallenges || withOfflineGames) {
    key = 'games-menu';
    action = gamesMenu.open;
  } else {
    key = 'new-game-form';
    action = newGameForm.open;
  }
  const myTurns = session.myTurnGames().length;
  const className = [
    'main_header_button',
    'game_menu_button',
    settings.general.theme.board(),
    nbIncomingChallenges ? 'new_challenge' : '',
    !utils.hasNetwork() && utils.getOfflineGames().length === 0 ? 'invisible' : ''
    ].join(' ');
  const longAction = () => window.plugins.toast.show(i18n('nbGamesInPlay', session.nowPlaying().length), 'short', 'top');

  return (
    <button key={key} className={className} config={helper.ontouch(action, longAction)}>
      {!nbIncomingChallenges && myTurns ?
        <span className="chip nb_playing">{myTurns}</span> : null
      }
      {nbIncomingChallenges ?
        <span className="chip nb_challenges">{nbChallenges}</span> : null
      }
    </button>
  );
}

export function headerBtns() {
  if (utils.hasNetwork() && session.isConnected() && friendsApi.count())
    return (
      <div className="buttons">
        {friendsButton()}
        {gamesButton()}
      </div>
    );
  else
    return gamesButton();
}

export function header(title, leftButton) {
  return (
    <nav>
      {leftButton ? leftButton : menuButton()}
      {title ? <h1>{title}</h1> : null}
      {headerBtns()}
    </nav>
  );
}

export const loader = (
  <div className="loader_circles">
    {[1, 2, 3].map(i => <div className={'circle_' + i} />)}
  </div>
);

export function connectingHeader(title) {
  return (
    <nav>
      {menuButton()}
      <h1 className={'reconnecting' + (title ? 'withTitle' : '')}>
        {title ? <span>{title}</span> : null}
        {loader}
      </h1>
      {headerBtns()}
    </nav>
  );
}

export function viewOnlyBoardContent(fen, lastMove, orientation, variant) {
  const x = helper.viewportDim().vw;
  const boardStyle = helper.isLandscape() ? {} : { width: x + 'px', height: x + 'px' };
  const boardKey = helper.isLandscape() ? 'landscape' : 'portrait';
  return (
    <div className="content_round onlyBoard">
      <section key={boardKey} className="board_wrapper" style={boardStyle}>
        {m.component(ViewOnlyBoard, {fen, lastMove, orientation, variant})}
      </section>
    </div>
  );
}

export function empty() {
  return [];
}

export function pad(num, size) {
    var s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
}

export function userStatus(user) {
  const status = user.online ? 'online' : 'offline';
  return (
    <div className="user">
      <span className={'userStatus ' + status} data-icon="r" />
      {user.title ? <span className="userTitle">{user.title}&nbsp;</span> : null}
      {user.username}
    </div>
  );
}
