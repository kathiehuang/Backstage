import React from 'react';
import { Navigate, Route } from 'react-router';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage/plugin-tech-radar';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';

import { AlertDisplay, OAuthRequestDialog } from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { FlatRoutes } from '@backstage/core-app-api';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { PermissionedRoute } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { githubAuthApiRef } from '@backstage/core-plugin-api';
import { SignInPage } from '@backstage/core-components';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import LightIcon from '@material-ui/icons/WbSunny';
import {
  createTheme,
  genPageTheme,
  lightTheme,
  shapes,
} from '@backstage/theme';

const myTheme = createTheme({
  palette: {
    ...lightTheme.palette,
    primary: {
      main: '#343b58',
    },
    secondary: {
      main: '#565a6e',
    },
    error: {
      main: '#8c4351',
    },
    warning: {
      main: '#8f5e15',
    },
    info: {
      main: '#34548a',
    },
    success: {
      main: '#485e30',
    },
    background: {
      default: '#d5d6db',
      paper: '#d5d6db',
    },
    banner: {
      info: '#34548a',
      error: '#8c4351',
      text: '#343b58',
      link: '#565a6e',
    },
    errorBackground: '#8c4351',
    warningBackground: '#8f5e15',
    infoBackground: '#343b58',
    navigation: {
      background: '#343b58',
      indicator: '#8f5e15',
      color: '#d5d6db',
      selectedColor: '#ffffff',
    },
  },
  defaultPageTheme: 'home',
  fontFamily: 'Roboto',
  /* below drives the header colors */
  pageTheme: {
    home: genPageTheme(['#8c4351', '#343b58'], shapes.wave),
    documentation: genPageTheme(['#8c4351', '#343b58'], shapes.wave2),
    tool: genPageTheme(['#8c4351', '#343b58'], shapes.round),
    service: genPageTheme(['#8c4351', '#343b58'], shapes.wave),
    website: genPageTheme(['#8c4351', '#343b58'], shapes.wave),
    library: genPageTheme(['#8c4351', '#343b58'], shapes.wave),
    other: genPageTheme(['#8c4351', '#343b58'], shapes.wave),
    app: genPageTheme(['#8c4351', '#343b58'], shapes.wave),
    apis: genPageTheme(['#8c4351', '#343b58'], shapes.wave),
  },
});

const app = createApp({
  apis,
  themes: [{
    id: 'my-theme',
    title: 'My Custom Theme',
    variant: 'light',
    icon: <LightIcon />,
    Provider: ({ children }) => (
      <ThemeProvider theme={myTheme}>
        <CssBaseline>{children}</CssBaseline>
      </ThemeProvider>
    ),
  }],
  components: {
    SignInPage: props => (
      <SignInPage
        {...props}
        providers={['guest', {
          id: 'github-auth-provider',
          title: 'GitHub',
          message: 'Sign in using GitHub',
          apiRef: githubAuthApiRef,
        }]}
      />
    ),
  },
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
  },
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

const routes = (
  <FlatRoutes>
    <Navigate key="/" to="catalog" />
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/docs" element={<TechDocsIndexPage />} />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      <TechDocsAddons>
        <ReportIssue />
      </TechDocsAddons>
    </Route>
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
    <PermissionedRoute
      path="/catalog-import"
      permission={catalogEntityCreatePermission}
      element={<CatalogImportPage />}
    />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
  </FlatRoutes>
);

const App = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </AppProvider>
);

export default App;
