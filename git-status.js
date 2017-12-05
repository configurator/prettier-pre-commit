// cf. Definition of git_status_t in https://github.com/libgit2/libgit2/blob/master/include/git2/status.h
module.exports = {
	GIT_STATUS_CURRENT: 0,

	GIT_STATUS_INDEX_NEW: 1 << 0,
	GIT_STATUS_INDEX_MODIFIED: 1 << 1,
	GIT_STATUS_INDEX_DELETED: 1 << 2,
	GIT_STATUS_INDEX_RENAMED: 1 << 3,
	GIT_STATUS_INDEX_TYPECHANGE: 1 << 4,

	GIT_STATUS_WT_NEW: 1 << 7,
	GIT_STATUS_WT_MODIFIED: 1 << 8,
	GIT_STATUS_WT_DELETED: 1 << 9,
	GIT_STATUS_WT_TYPECHANGE: 1 << 10,
	GIT_STATUS_WT_RENAMED: 1 << 11,
	GIT_STATUS_WT_UNREADABLE: 1 << 12,

	GIT_STATUS_IGNORED: 1 << 14,
	GIT_STATUS_CONFLICTED: 1 << 15,
};