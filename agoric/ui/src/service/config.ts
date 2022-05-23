
// const state = {
//   walletConnected: false,
//   dappApproved: true,
//   characters: [],
//   characterPurse: null,
//   tokenPurses: [],
//   openEnableAppDialog: false,
//   needToApproveOffer: false,
//   tokenPetname: null as null | string,
// }

// const init = () => {
//     // Receive callbacks from the wallet connection.
//     const otherSide = Far('otherSide', {
//       needDappApproval(_dappOrigin, _suggestedDappPetname) {
//         setDappApproved(false);
//         setOpenEnableAppDialog(true);
//       },
//       dappApproved(_dappOrigin) {
//         setDappApproved(true);
//       },
//     });

//     let walletAbort;
//     let walletDispatch;

//     const onConnect = async () => {
//       setWalletConnected(true);
//       const socket = getActiveSocket();
//       const {
//         abort: ctpAbort,
//         dispatch: ctpDispatch,
//         getBootstrap,
//       } = makeCapTP(
//         'Card Store',
//         (obj) => socket.send(JSON.stringify(obj)),
//         otherSide,
//       );
//       walletAbort = ctpAbort;
//       walletDispatch = ctpDispatch;
//       const walletP = getBootstrap();
//       walletPRef.current = walletP;

//       const processPurses = (purses) => {
//         const newTokenPurses = purses.filter(
//           ({ brandBoardId }) => brandBoardId === MONEY_BRAND_BOARD_ID,
//         );
//         const newCardPurse = purses.find(
//           ({ brandBoardId }) => brandBoardId === CARD_BRAND_BOARD_ID,
//         );

//         setTokenPurses(newTokenPurses);
//         setTokenDisplayInfo(newTokenPurses[0].displayInfo);
//         setTokenPetname(newTokenPurses[0].brandPetname);
//         setCardPurse(newCardPurse);
//       };

//       async function watchPurses() {
//         const pn = E(walletP).getPursesNotifier();
//         for await (const purses of iterateNotifier(pn)) {
//           // dispatch(setPurses(purses));
//           processPurses(purses);
//         }
//       }
//       watchPurses().catch((err) => console.error('got watchPurses err', err));

//       await Promise.all([
//         E(walletP).suggestInstallation('Installation', INSTALLATION_BOARD_ID),
//         E(walletP).suggestInstance('Instance', INSTANCE_BOARD_ID),
//         E(walletP).suggestIssuer('Card', CARD_ISSUER_BOARD_ID),
//       ]);

//       const zoe = E(walletP).getZoe();
//       const board = E(walletP).getBoard();
//       const instance = await E(board).getValue(INSTANCE_BOARD_ID);
//       const publicFacet = E(zoe).getPublicFacet(instance);
//       publicFacetRef.current = publicFacet;

//       const availableItemsNotifier = E(
//         publicFacetRef.current,
//       ).getAvailableItemsNotifier();

//       for await (const cardsAvailableAmount of iterateNotifier(
//         availableItemsNotifier,
//       )) {
//         setAvailableCards(cardsAvailableAmount.value);
//       }
//     };

//     const onDisconnect = () => {
//       setWalletConnected(false);
//       walletAbort && walletAbort();
//     };

//     const onMessage = (data) => {
//       const obj = JSON.parse(data);
//       walletDispatch && walletDispatch(obj);
//     };

//     activateWebSocket({
//       onConnect,
//       onDisconnect,
//       onMessage,
//     });
//     return deactivateWebSocket;
//   }

//TODO: consider deleting if unneeded
export const a = ""