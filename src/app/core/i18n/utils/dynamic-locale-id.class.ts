import { registerLocaleData } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, startWith } from 'rxjs/operators';

export class DynamicLocaleId extends String {
  constructor(protected translate: TranslateService, _langs: string[]) {
    super('');
    const langs = _langs;

    this.translate.onLangChange.pipe(
      map(({ lang }) => lang),
      startWith(this.translate.currentLang),
      filter(Boolean)
    ).subscribe(async (lang: string) => {
      if ((langs || []).includes(lang)) {
        langs.splice(langs.indexOf(lang), 1);
        const angularLocale = await this.loadLocale(lang);
        registerLocaleData(angularLocale.default);
      }
    });

  }

  private loadLocale(lang: string): Promise<any> {
    switch (lang) {
      case 'es':
        return import(`@angular/common/locales/es`);
      case 'en':
        return import(`@angular/common/locales/en`);
      default:
        return Promise.reject('Locale not supported');
    }
  }

  toString() {
    return this.translate.currentLang;
  }
}
