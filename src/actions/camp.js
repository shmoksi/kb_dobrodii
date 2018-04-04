import { wrapRequest } from 'services/ajax';

export const createCamp = data =>
  wrapRequest({
    method: 'POST',
    url: '/api/camp',
    data,
  });

// import dispatchSend from 'services/dispatchSend';
// import { roleCRUD } from './cruds';

// export const getRoleProfile = id =>
//   dispatchSend('roleProfile', roleCRUD.get(id));
//
// export const getRoleCriteria = id =>
//   dispatchSend(
//     'roleProfileCriteria',
//     roleCRUD.getList({ additionalUrl: `${id}/criteria` }),
//     {
//       adaptData: data => {
//         let i = 0;
//         data.data.forEach(item => (item.key = i++));
//         return data;
//       },
//     },
//   );
