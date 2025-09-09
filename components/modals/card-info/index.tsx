import Image from 'next/image';
import { Modal } from '../index'
import { Section } from '@/components/layouts/section';

type CardInfoModal = {
    description: string;
    label: string;
    onClose: () => void;
    isOpen: boolean;
    image: string;
}

export const CardInfoModal = ({ description, onClose, isOpen, label, image }: CardInfoModal) => {

    return (
        <Modal isOpen={isOpen} className='p-5 flex flex-col w-full h-full items-center justify-center gap-5'>
            <div className="flex text-lg w-full justify-between">
                <h2 className='text-purple-300 font-bold flex-1 text-center'>{label}</h2>
                <span onClick={onClose} className='text-white cursor-pointer'>X</span>
            </div>
            <Image src={image} width={256} height={456} alt='' />
            <p className='text-white text-lg text-center'>{description}</p>
        </Modal>
    )
}