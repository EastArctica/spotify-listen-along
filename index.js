const { Plugin } = require('powercord/entities');
const { FluxDispatcher, getModule, constants } = require('powercord/webpack');

let originalGetProfile = null;
let originalIsSpotifyPremium = null;

module.exports = class SpotifyListenAlong extends Plugin {
    async startPlugin() {
        originalGetProfile = getModule(['getProfile'], false).getProfile;
        originalIsSpotifyPremium = getModule(['isSpotifyPremium'], false).isSpotifyPremium;

        getModule(['getProfile'], false).getProfile = (id, token) => {
            FluxDispatcher.dispatch({
                type: constants.ActionTypes.SPOTIFY_PROFILE_UPDATE,
                accountId: id,
                isPremium: true
            });
            return token;
        }
        getModule(['isSpotifyPremium'], false).isSpotifyPremium = () => true;
    }

    async pluginWillUnload() {
        (await getModule(['getProfile'], false)).getProfile = originalGetProfile;
        (await getModule(['isSpotifyPremium'], false)).isSpotifyPremium = originalIsSpotifyPremium;
    }
};
