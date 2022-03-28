const GroupService = require('../services/GroupService');
const UserService = require('../services/UserService');
const PostService = require('../services/PostService');

const GroupDTO = require('../dtos/GroupDto');
const UserDTO = require('../dtos/UserDto');
const PostDTO = require('../dtos/PostDto');

const { getPaginationData } = require('../utills');

const byTypes = {
  posts: 'posts',
  users: 'users',
  groups: 'groups',
};

const getSearchData = (by = '') => {
  switch (by) {
    case byTypes.groups: {
      const Service = GroupService;

      return {
        Service,
        totalCount: Service.searchTotalCount,
        search: Service.search,
        DTO: GroupDTO,
      };
    }

    case byTypes.users: {
      const Service = UserService;

      return {
        Service,
        totalCount: Service.searchTotalCount,
        search: Service.search,
        DTO: UserDTO,
      };
    }

    case byTypes.posts: {
      const Service = PostService;

      return {
        Service,
        totalCount: Service.searchTotalCount,
        search: Service.search,
        DTO: PostDTO,
      };
    }

    default:
      throw new Error('By param is unknown');
  }
};

exports.search = async (req, res, next) => {
  try {
    const searchQuery = req.query.q;
    const { page: pageQuery, limit: limitQuery, by } = req.query;

    const {
      Service,
      totalCount: totalCountMethod,
      search: searchMethod,
      DTO,
    } = getSearchData(by);

    const totalCount = await totalCountMethod.call(Service, searchQuery);

    const { page, limit, startIndex, numberOfPages } = getPaginationData(
      pageQuery,
      limitQuery,
      totalCount
    );

    const resultsList = await searchMethod.call(
      Service,
      searchQuery,
      limit,
      startIndex
    );

    const results = resultsList.map((item) => new DTO(item));

    return res.json({ currentPage: page, numberOfPages, results });
  } catch (e) {
    return next(e);
  }
};
