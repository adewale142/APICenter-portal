import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import ApiList from '@/experiences/ApiList';
import AccessDeniedSvg from '@/assets/accessDenied.svg';
import ReckittLogo from '@/assets/reckitt-logo.svg';
import { isAuthenticatedAtom } from '@/atoms/isAuthenticatedAtom';
import { isAccessDeniedAtom } from '@/atoms/isAccessDeniedAtom';
import ApiSearchBox from '@/experiences/ApiSearchBox';
import CategoryPills from '@/experiences/CategoryPills';
import AddFilterDropdown from '@/experiences/AddFilterDropdown';
import ApiListLayoutSwitch from '@/experiences/ApiListLayoutSwitch';
import ApiListSortingSelect from '@/experiences/ApiListSortingSelect';
import { ActiveFiltersBadges } from '@/experiences/ActiveFiltersBadges/ActiveFiltersBadges';
import { setDocumentTitle } from '@/utils/dom';
import styles from './Home.module.scss';

const PORTAL_TITLE = 'Reckitt API portal';

export const Home: React.FC = () => {
  const isAuthenticated = useRecoilValue(isAuthenticatedAtom);
  const isAccessDenied = useRecoilValue(isAccessDeniedAtom);

  useEffect(() => {
    setDocumentTitle(PORTAL_TITLE);
  }, []);

  function renderApiList() {
    if (!isAuthenticated) {
      return (
        <div className={styles.emptyState}>
          <img src={AccessDeniedSvg} alt="" />
          Sign in or create an account to view APIs.
        </div>
      );
    }

    if (isAccessDenied) {
      return (
        <div className={styles.emptyState}>
          <img src={AccessDeniedSvg} alt="" />
          You don&apos;t have permission to access this developer portal.
          Please contact this developer portal&apos;s administrator for
          assistance.
        </div>
      );
    }

    return <ApiList />;
  }

  return (
    <div className={styles.home}>
      <header className={styles.brandBar}>
        <div className={styles.brandInner}>
          <img className={styles.logo} src={ReckittLogo} alt="Reckitt" />
        </div>
      </header>

      <div className={styles.searchPanel}>
        <div className={styles.bannerHeader}>
          <h1>{PORTAL_TITLE}</h1>
          <p className={styles.subtitle}>Discover and consume Reckitt APIs</p>
        </div>

        <div className={styles.searchRow}>
          <ApiSearchBox />
          <ApiListSortingSelect />
          <AddFilterDropdown />
        </div>
      </div>

      <section className={styles.content}>
        <div className={styles.pillsRow}>
          <CategoryPills />
          <ApiListLayoutSwitch />
        </div>

        <div className={styles.mainContent}>
          <ActiveFiltersBadges className={styles.activeFilters} />
          <div className={styles.results}>{renderApiList()}</div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(Home);