'use client'

import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { Icon } from "@/components/ui/icon/Icon";
import { ProgressSteps } from "@/components/ui/progress-bar";
import { useTranslation } from "react-i18next";
import { useNotify } from "@/providers/notify-provider";
import { cn } from "@/lib/utils";
import { Share } from "@capacitor/share";
import { Clipboard } from '@capacitor/clipboard';

export function Quests() {
  const { t } = useTranslation()
  const { notify } = useNotify();
  const [isGenerate, setIsGenerate] = useState(false)
  const [isApplied, setIsApplied] = useState(false)
  const [promoCodeGenerate, setPromoCodeGenerate] = useState<string>('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('')

  const handleCopyToClipboard = async () => {
    try {
      await Clipboard.write({string: promoCodeGenerate});
      notify('info', t('quests.notification.copied'));
    } catch (err) {
      console.error('Copy error: ', err);
      notify('error', 'Copy failed');
    }
  };

  const handleSharePromoCode = async () => {
    try {
      if (typeof Share !== 'undefined' && (await Share.canShare()).value) {
        await Share.share({
          title: t('share.title', 'Share promo code'),
          text: t('share.text', 'My promo code: {{code}}', { code: promoCodeGenerate }),
          dialogTitle: t('share.dialogTitle', 'Share with friends'),
        });
      } else if (navigator.share) {
        await navigator.share({
          title: t('share.title', 'Share promo code'),
          text: t('share.text', 'My promo code: {{code}}', { code: promoCodeGenerate }),
        });
      } else {
        await handleCopyToClipboard()
      }
    } catch (err) {
      console.error('Share error: ', err);
      if (err !== 'Share canceled') {
        notify('error', 'Share error')
      }
    }
  }

  const handleAppliedPromoCode = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(appliedPromoCode == promoCodeGenerate) {
      setIsApplied(true)
      notify('info', t('quests.notification.applied'))
    } else {
      notify('error', 'promo code application error')
      console.error('promo code application error')
    }
  }

  const handleGeneratePromoCode = () => {
    setPromoCodeGenerate('GgdX-Hu4k-KDj2-N3br')
    setIsGenerate(true)
  }

  return (
    <Section className="max-h-[70vh] overflow-y-auto hide-scrollbar">
      <SectionTitle>
        <h2 className="">{t('quests.title')}</h2>
      </SectionTitle>
      <div className="flex flex-col gap-8">
        <ProgressSteps currentStep={0} totalSteps={5}/>
        <div id="generate code" className="flex gap-3" >
          {isGenerate ? (<>
            <Input value={promoCodeGenerate} readOnly classNameWrapper="w-full"/>
            <Button variant="outline" className="px-3" onClick={handleCopyToClipboard}>
              <Icon name={'copy'} width={16} height={16}/>
            </Button>
            <Button variant="outline" className="px-3" onClick={handleSharePromoCode}>
              <Icon name={'share'} width={16} height={16}/>
            </Button>
          </>) : (
            <Button variant={'primary'} className="w-full" onClick={handleGeneratePromoCode}>
              {t('quests.generateCode.button.text')}
            </Button>
          )}
        </div>
        <form data-id='apply-code' 
          className={cn("flex flex-col gap-3", isApplied && 'pointer-events-none')} 
          onSubmit={(e) => handleAppliedPromoCode(e)}
        >
          <Input 
            label={t('quests.promoCode.label')} 
            placeholder={t('quests.promoCode.input.placeholder')} 
            value={appliedPromoCode} 
            onChange={(e) => setAppliedPromoCode(e.currentTarget.value)}
          />
          <Button variant={isApplied ? "outline" : 'primary'}>{isApplied ? t('quests.promoCode.button.applied') : t('quests.promoCode.button.apply')}</Button>
        </form>
      </div>
    </Section>
  )
}