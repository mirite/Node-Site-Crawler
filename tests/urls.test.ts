import urls from '../src/urls';

type Test = {

    // eslint-disable-next-line no-unused-vars
    function: (url: string) => string|boolean,
    expected: string|boolean,
}

type TestGroup = {
  input: string,
  tests: Array<Test>,
}

function formatLinkTestBridge(url: string): string {
  return urls.formatLink(url, 'jesseconner.ca', 'https://jesseconner.ca/pages/');
}

function formatLinkTestBridgeFile(url: string): string {
  return urls.formatLink(url, 'jesseconner.ca', 'https://jesseconner.ca/pages/index.php');
}

const testStrings: Array<TestGroup> = [
  {
    input: 'https://jesseconner.ca',
    tests: [
      {
        function: urls.findProtocol,
        expected: 'https',
      },
      {
        function: urls.findDomain,
        expected: 'jesseconner.ca',
      },
      {
        function: urls.findPath,
        expected: '/',
      },
      {
        function: urls.isOnPageAnchor,
        expected: false,
      },
      {
        function: urls.findFileName,
        expected: '',
      },
      {
        function: urls.findFileType,
        expected: '',
      },
      {
        function: urls.isRelativeToPage,
        expected: false,
      },
      {
        function: urls.isRelativeToRoot,
        expected: false,
      },
      {
        function: formatLinkTestBridge,
        expected: 'https://jesseconner.ca/',
      },

    ],

  },
  {
    input: '//SomeCDN/asset.css',
    tests: [{
      function: urls.findProtocol,
      expected: 'https',
    },
    {
      function: urls.findDomain,
      expected: 'somecdn',
    },
    {
      function: urls.findPath,
      expected: '/asset.css',
    },
    {
      function: urls.isOnPageAnchor,
      expected: false,
    },
    {
      function: urls.isRoot,
      expected: false,
    },
    {
      function: urls.isRelativeToPage,
      expected: false,
    },
    {
      function: urls.isRelativeToRoot,
      expected: false,
    },
    {
      function: urls.findFileName,
      expected: 'asset.css',
    },

    {
      function: urls.findFileType,
      expected: 'css',
    },
    {
      function: formatLinkTestBridge,
      expected: 'https://somecdn/asset.css',
    },
    ],
  },
  {
    input: '//assets.SomeCDN/asset.css',
    tests: [{
      function: urls.findProtocol,
      expected: 'https',
    },
    {
      function: urls.findDomain,
      expected: 'assets.somecdn',
    },
    {
      function: urls.findPath,
      expected: '/asset.css',
    },
    {
      function: urls.isOnPageAnchor,
      expected: false,
    },
    {
      function: urls.isRoot,
      expected: false,
    },
    {
      function: urls.isRelativeToPage,
      expected: false,
    },
    {
      function: urls.isRelativeToRoot,
      expected: false,
    },
    {
      function: urls.findFileName,
      expected: 'asset.css',
    },

    {
      function: urls.findFileType,
      expected: 'css',
    },
    {
      function: formatLinkTestBridge,
      expected: 'https://assets.somecdn/asset.css',
    },
    ],
  },
  {
    input: '//jesseconner.ca/',
    tests: [{
      function: urls.findProtocol,
      expected: 'https',
    },
    {
      function: urls.findDomain,
      expected: 'jesseconner.ca',
    },
    {
      function: urls.findPath,
      expected: '/',
    },
    {
      function: urls.isOnPageAnchor,
      expected: false,
    },
    {
      function: urls.isRoot,
      expected: true,
    },
    {
      function: urls.isRelativeToPage,
      expected: false,
    },
    {
      function: urls.isRelativeToRoot,
      expected: false,
    },
    {
      function: urls.findFileName,
      expected: '',
    },

    {
      function: urls.findFileType,
      expected: '',
    },
    {
      function: formatLinkTestBridge,
      expected: 'https://jesseconner.ca/',
    },
    ],
  },
  {
    input: 'ftp://127.0.0.1',
    tests: [{
      function: urls.findProtocol,
      expected: 'ftp',
    },
    {
      function: urls.findDomain,
      expected: '127.0.0.1',
    },
    {
      function: urls.findPath,
      expected: '/',
    },
    {
      function: urls.isOnPageAnchor,
      expected: false,
    },
    {
      function: urls.isRoot,
      expected: true,
    },
    {
      function: urls.isRelativeToPage,
      expected: false,
    },
    {
      function: urls.isRelativeToRoot,
      expected: false,
    },
    {
      function: urls.findFileName,
      expected: '',
    },

    {
      function: urls.findFileType,
      expected: '',
    },
    {
      function: formatLinkTestBridge,
      expected: 'ftp://127.0.0.1/',
    },
    ],
  },
  {
    input: '/index.html',
    tests: [{
      function: urls.findProtocol,
      expected: '',
    },
    {
      function: urls.findDomain,
      expected: '',
    },
    {
      function: urls.findPath,
      expected: '/index.html',
    },
    {
      function: urls.isOnPageAnchor,
      expected: false,
    },
    {
      function: urls.isRoot,
      expected: false,
    },
    {
      function: urls.isRelativeToPage,
      expected: false,
    },
    {
      function: urls.isRelativeToRoot,
      expected: true,
    },
    {
      function: urls.findFileName,
      expected: 'index.html',
    },

    {
      function: urls.findFileType,
      expected: 'html',
    },
    {
      function: formatLinkTestBridge,
      expected: 'https://jesseconner.ca/index.html',
    },
    ],
  },
  {
    input: '/',
    tests: [{
      function: urls.findProtocol,
      expected: '',
    },
    {
      function: urls.findDomain,
      expected: '',
    },
    {
      function: urls.findPath,
      expected: '/',
    },
    {
      function: urls.isOnPageAnchor,
      expected: false,
    },
    {
      function: urls.isRoot,
      expected: true,
    },
    {
      function: urls.isRelativeToPage,
      expected: false,
    },
    {
      function: urls.isRelativeToRoot,
      expected: true,
    },
    {
      function: urls.findFileName,
      expected: '',
    },

    {
      function: urls.findFileType,
      expected: '',
    },
    {
      function: formatLinkTestBridge,
      expected: 'https://jesseconner.ca/',
    },
    ],
  },
  {
    input: 'folder/index',
    tests: [
      {
        function: urls.findProtocol,
        expected: '',
      },
      {
        function: urls.findDomain,
        expected: '',
      },
      {
        function: urls.findPath,
        expected: 'folder/index/',
      },
      {
        function: urls.isOnPageAnchor,
        expected: false,
      },
      {
        function: urls.isRoot,
        expected: false,
      },
      {
        function: urls.isRelativeToPage,
        expected: true,
      },
      {
        function: urls.isRelativeToRoot,
        expected: false,
      },
      {
        function: urls.findFileName,
        expected: '',
      },

      {
        function: urls.findFileType,
        expected: '',
      },
      {
        function: formatLinkTestBridge,
        expected: 'https://jesseconner.ca/pages/folder/index/',
      },
      {
        function: formatLinkTestBridgeFile,
        expected: 'https://jesseconner.ca/pages/folder/index/',
      },
    ],
  },
  {
    input: 'bad//relative',
    tests: [
      {
        function: urls.findProtocol,
        expected: '',
      },
      {
        function: urls.findDomain,
        expected: '',
      },
      {
        function: urls.findPath,
        expected: 'bad/relative/',
      },
      {
        function: urls.isOnPageAnchor,
        expected: false,
      },
      {
        function: urls.isRoot,
        expected: false,
      },
      {
        function: urls.isRelativeToPage,
        expected: true,
      },
      {
        function: urls.isRelativeToRoot,
        expected: false,
      },
      {
        function: urls.findFileName,
        expected: '',
      },

      {
        function: urls.findFileType,
        expected: '',
      },
      {
        function: formatLinkTestBridge,
        expected: 'https://jesseconner.ca/pages/bad/relative/',
      },
    ],
  },
  {
    input: '#',
    tests: [
      {
        function: urls.findProtocol,
        expected: '',
      },
      {
        function: urls.findDomain,
        expected: '',
      },
      {
        function: urls.findPath,
        expected: '',
      },
      {
        function: urls.isOnPageAnchor,
        expected: true,
      },
      {
        function: urls.isRoot,
        expected: false,
      },
      {
        function: urls.isRelativeToPage,
        expected: false,
      },
      {
        function: urls.isRelativeToRoot,
        expected: false,
      },
      {
        function: urls.findFileName,
        expected: '',
      },

      {
        function: urls.findFileType,
        expected: '',
      },
      {
        function: formatLinkTestBridge,
        expected: '',
      },
    ],
  },
  {
    input: '#somewhere',
    tests: [
      {
        function: urls.findProtocol,
        expected: '',
      },
      {
        function: urls.findDomain,
        expected: '',
      },
      {
        function: urls.findPath,
        expected: '',
      },
      {
        function: urls.isOnPageAnchor,
        expected: true,
      },
      {
        function: urls.isRoot,
        expected: false,
      },
      {
        function: urls.isRelativeToPage,
        expected: false,
      },
      {
        function: urls.isRelativeToRoot,
        expected: false,
      },
      {
        function: urls.findFileName,
        expected: '',
      },

      {
        function: urls.findFileType,
        expected: '',
      },
      {
        function: formatLinkTestBridge,
        expected: '',
      },
    ],
  },
  {
    input: 'http://localhost/#home',
    tests: [
      {
        function: urls.findProtocol,
        expected: 'http',
      },
      {
        function: urls.findDomain,
        expected: 'localhost',
      },
      {
        function: urls.findPath,
        expected: '/',
      },
      {
        function: urls.isOnPageAnchor,
        expected: false,
      },
      {
        function: urls.isRoot,
        expected: true,
      },
      {
        function: urls.isRelativeToPage,
        expected: false,
      },
      {
        function: urls.isRelativeToRoot,
        expected: false,
      },
      {
        function: urls.findFileName,
        expected: '',
      },

      {
        function: urls.findFileType,
        expected: '',
      },
      {
        function: formatLinkTestBridge,
        expected: 'http://localhost/',
      },
    ],
  },
  {
    input: 'somefolder.php#home',
    tests: [
      {
        function: urls.findProtocol,
        expected: '',
      },
      {
        function: urls.findDomain,
        expected: '',
      },
      {
        function: urls.findPath,
        expected: 'somefolder.php',
      },
      {
        function: urls.isOnPageAnchor,
        expected: false,
      },
      {
        function: urls.isRoot,
        expected: false,
      },
      {
        function: urls.isRelativeToPage,
        expected: true,
      },
      {
        function: urls.isRelativeToRoot,
        expected: false,
      },
      {
        function: urls.findFileName,
        expected: 'somefolder.php',
      },

      {
        function: urls.findFileType,
        expected: 'php',
      },
      {
        function: formatLinkTestBridge,
        expected: 'https://jesseconner.ca/pages/somefolder.php',
      },
    ],
  },
  {
    input: '/path/someimage.png?size=1x1',
    tests: [
      {
        function: urls.findProtocol,
        expected: '',
      },
      {
        function: urls.findDomain,
        expected: '',
      },
      {
        function: urls.findPath,
        expected: '/path/someimage.png?size=1x1',
      },
      {
        function: urls.isOnPageAnchor,
        expected: false,
      },
      {
        function: urls.isRoot,
        expected: false,
      },
      {
        function: urls.isRelativeToPage,
        expected: false,
      },
      {
        function: urls.isRelativeToRoot,
        expected: true,
      },
      {
        function: urls.findFileName,
        expected: 'someimage.png?size=1x1',
      },

      {
        function: urls.findFileType,
        expected: 'png',
      },
      {
        function: formatLinkTestBridge,
        expected: 'https://jesseconner.ca/path/someimage.png?size=1x1',
      },
    ],
  },
  {
    input: 'https://jesseconner.ca/_nuxt/icons/icon_64x64.5f6a36.png',
    tests: [
      {
        function: urls.findProtocol,
        expected: 'https',
      },
      {
        function: urls.findDomain,
        expected: 'jesseconner.ca',
      },
      {
        function: urls.findPath,
        expected: '/_nuxt/icons/icon_64x64.5f6a36.png',
      },
      {
        function: urls.isOnPageAnchor,
        expected: false,
      },
      {
        function: urls.isRoot,
        expected: false,
      },
      {
        function: urls.isRelativeToPage,
        expected: false,
      },
      {
        function: urls.isRelativeToRoot,
        expected: false,
      },
      {
        function: urls.findFileName,
        expected: 'icon_64x64.5f6a36.png',
      },

      {
        function: urls.findFileType,
        expected: 'png',
      },
      {
        function: formatLinkTestBridge,
        expected: 'https://jesseconner.ca/_nuxt/icons/icon_64x64.5f6a36.png',
      },
    ],
  },
  {
    input: '',
    tests: [
      {
        function: urls.findProtocol,
        expected: '',
      },
      {
        function: urls.findDomain,
        expected: '',
      },
      {
        function: urls.findPath,
        expected: '',
      },
      {
        function: urls.isOnPageAnchor,
        expected: false,
      },
      {
        function: urls.isRoot,
        expected: false,
      },
      {
        function: urls.isRelativeToPage,
        expected: false,
      },
      {
        function: urls.isRelativeToRoot,
        expected: false,
      },
      {
        function: urls.findFileName,
        expected: '',
      },

      {
        function: urls.findFileType,
        expected: '',
      },
      {
        function: formatLinkTestBridge,
        expected: '',
      },
    ],
  },
  {
    input: 'https://jesseconner.ca/fc/?s%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f/',
    tests: [
      {
        function: urls.removeSlashCode,
        expected: 'https://jesseconner.ca/fc/?s',
      },
    ],
  },
];

testStrings.forEach((group) => {
  group.tests.forEach((urlTest) => {
    test(`${urlTest.function.name} for ${group.input} returns ${urlTest.expected}`, () => {
      expect(urlTest.function(group.input)).toBe(urlTest.expected);
    });
  });
});
