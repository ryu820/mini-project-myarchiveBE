const {getPost,ModifyPost} = require("../../controllers/mypage.controllers");

describe("getPost() mypage", () => {
  let mypageService;
  let req, res, next;
  beforeEach(() => {
    mypageService = {
      getPost: jest.fn(),
    };
    req = {};
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
      locals: { user: { userId: 'testUser' } },
    };
    next = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("성공했을 시 내가 쓴 게시글을 호출", async () => {
    const postslist = [{ id: 1, title: "test post" }];
    mypageService.getPost.mockResolvedValueOnce();

    // when
    await mypageService.getPost(req, res, next);

    // then
    expect(res.status).toHaveBeenCalledWith(200);//res.status가 200과 함께 제대로 호출되었는지확인
    expect(res.json).toHaveBeenCalledWith(postslist);
    expect(next).not.toHaveBeenCalled();//next 가 호출되지 않는지 확인 ->toHaveBeenCalled()는 제대로 호출되는지 확인

  });

  test("실패하면 에러발생", async () => {
    // given
    const error = new Error("getPost failed");
    mypageService.getPost.mockResolvedValueOnce();

    // when
    await mypageService.getPost(req, res, next);

    // then
    expect(res.status).not.toHaveBeenCalled();  
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});

describe("ModifyPost() mypage", () => {
  const userId = 1;
  const postId = 1;
  const postUrl = "https://example.com";
  const title = "Example Title";
  const desc = "Example Description";
  const mockNext = jest.fn();
  let mypageService;

  beforeEach(() => {
    mypageService = {
      existPost: jest.fn(),
      ModifyPost: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("성공했을 시 게시글 수정완료", async () => {
    const mockReq = {
      params: { postId },
      body: { url: postUrl, title, desc },
    };
    const mockRes = {
      locals: { user: { userId } },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mypageService.existPost.mockResolvedValueOnce();
    mypageService.ModifyPost.mockResolvedValueOnce();

    await mypageService.ModifyPost(mockReq, mockRes, mockNext, mypageService);

    expect(mypageService.existPost).toHaveBeenCalledWith({ postId, userId });
    expect(mypageService.ModifyPost).toHaveBeenCalledWith({
      postId,
      userId,
      postUrl,
      title,
      desc,
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "게시글을 수정하였습니다.",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next with an error if existPost throws an error", async () => {
    const mockReq = {
      params: { postId },
      body: { url: postUrl, title, desc },
    };
    const mockRes = {
      locals: { user: { userId } },
    };
    const mockError = new Error("existPost error");
    mypageService.existPost.mockRejectedValueOnce(mockError);

    await mypageService.ModifyPost(mockReq, mockRes, mockNext, mypageService);

    expect(mypageService.existPost).toHaveBeenCalledWith({ postId, userId });
    expect(mypageService.ModifyPost).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });

  it("should call next with an error if ModifyPost throws an error", async () => {
    const mockReq = {
      params: { postId },
      body: { url: postUrl, title, desc },
    };
    const mockRes = {
      locals: { user: { userId } },
    };
    const mockError = new Error("ModifyPost error");
    mypageService.existPost.mockResolvedValueOnce();
    mypageService.ModifyPost.mockRejectedValueOnce(mockError);

    await mypageService.ModifyPost(mockReq, mockRes, mockNext, mypageService);

    expect(mypageService.existPost).toHaveBeenCalledWith({ postId, userId });
    expect(mypageService.ModifyPost).toHaveBeenCalledWith({
      postId,
      userId,
      postUrl,
      title,
      desc,
    });
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});
