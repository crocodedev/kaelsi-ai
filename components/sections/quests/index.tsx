'use client'

import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { Icon } from "@/components/ui/icon/Icon";
import ProgressSteps from "@/components/ui/progress-bar";
import { useTranslation } from "react-i18next";
import { useNotify } from "@/providers/notify-provider";
import { cn } from "@/lib/utils";

export function Quests() {
  const { t } = useTranslation()
  const { notify } = useNotify();
  const [isGenerate, setIsGenerate] = useState(false)
  const [isApplied, setIsApplied] = useState(false)
  const [promoCodeGenerate, setPromoCodeGenerate] = useState<string>('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('')

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(promoCodeGenerate);
      notify('info', t('quests.notification.copied'))
    } catch (err) {
      notify('error', 'Copy error')
      console.error('Copy error: ', err);
    }
  };

  const handleSharePromoCode = () => {
    notify('info', 'Share promo code')
  }

  const BUTTON_ICONS = [
    {
      icon: 'copy',
      click: handleCopyToClipboard,
    },
    {
      icon: 'share',
      click: handleSharePromoCode,
    }
  ]

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
            {BUTTON_ICONS.map((el, i) => (
              <Button variant="outline" className="px-3" key={i} onClick={el.click}>
                <Icon name={el.icon as 'copy' | 'share'} width={16} height={16}/>
              </Button>
            ))}
          </>) : (
            <Button variant={'primary'} className="w-full" onClick={handleGeneratePromoCode}>
              {t('quests.generateCode.button.text')}
            </Button>
          )}
        </div>
        <form className={cn("flex flex-col gap-3", isApplied && 'pointer-events-none')} onSubmit={(e) => handleAppliedPromoCode(e)}>
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